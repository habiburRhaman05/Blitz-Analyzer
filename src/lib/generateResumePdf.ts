// Generates the resume PDF entirely in the browser from the compiled HTML,
// so nothing touches the (flaky) server puppeteer path or Cloudinary unless
// the user explicitly asks to share. Returns the Blob + the REAL page count
// (from jsPDF) so callers can warn when a resume spills past one page.

export interface GeneratedPdf {
  blob: Blob;
  pages: number;
}

export async function generateResumePdf(
  html: string,
  filename: string
): Promise<GeneratedPdf> {
  // Dynamic import: html2pdf.js touches `window` at module load, so it must
  // never be evaluated during SSR.
  const html2pdf: any = (await import("html2pdf.js")).default;

  // Render the full template document into an off-screen, same-document
  // container (html2canvas captures same-document elements reliably). We copy
  // the template's <style>/<link> from its <head> so its CSS still applies.
  const doc = new DOMParser().parseFromString(html, "text/html");

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-99999px";
  container.style.top = "0";
  container.style.width = "794px"; // ~ A4 width @ 96dpi
  container.style.background = "#ffffff";

  doc.querySelectorAll("style, link[rel='stylesheet']").forEach((el) => {
    container.appendChild(el.cloneNode(true));
  });
  const body = document.createElement("div");
  body.innerHTML = doc.body.innerHTML;
  container.appendChild(body);
  document.body.appendChild(container);

  try {
    const worker = html2pdf()
      .set({
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(container)
      .toPdf();

    const pdf = await worker.get("pdf");
    const pages: number = pdf.internal.getNumberOfPages();
    const blob: Blob = await worker.outputPdf("blob");

    return { blob, pages };
  } finally {
    document.body.removeChild(container);
  }
}
