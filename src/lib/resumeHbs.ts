import Handlebars from "handlebars";

// One hardened Handlebars instance shared by the live preview and the PDF
// generator, so both render identically and neither hard-crashes on a helper
// the template references but we don't register (unknown helpers -> empty).
const createResumeHbs = () => {
  const hbs = Handlebars.create();

  hbs.registerHelper("formatDate", (value: any, fmt?: any) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    const pattern = typeof fmt === "string" ? fmt : "MMM yyyy";
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return pattern
      .replace("yyyy", String(d.getFullYear()))
      .replace("MMM", months[d.getMonth()] ?? "")
      .replace("MM", String(d.getMonth() + 1).padStart(2, "0"))
      .replace("dd", String(d.getDate()).padStart(2, "0"));
  });
  hbs.registerHelper("join", (arr: any, sep?: any) =>
    Array.isArray(arr) ? arr.join(typeof sep === "string" ? sep : ", ") : ""
  );
  hbs.registerHelper("uppercase", (v: any) => String(v ?? "").toUpperCase());
  hbs.registerHelper("lowercase", (v: any) => String(v ?? "").toLowerCase());
  hbs.registerHelper("eq", (a: any, b: any) => a === b);
  hbs.registerHelper("ifEquals", function (this: any, a: any, b: any, opts: any) {
    return a === b ? opts.fn(this) : opts.inverse(this);
  });
  hbs.registerHelper("default", (v: any, fallback: any) => (v == null || v === "" ? fallback : v));

  hbs.registerHelper("helperMissing", () => "");
  hbs.registerHelper("blockHelperMissing", function (this: any, ctx: any, opts: any) {
    return ctx ? opts.fn(this) : opts.inverse(this);
  });

  return hbs;
};

const hbs = createResumeHbs();

// Compiles a template's htmlLayout against resume data. Throws on genuine
// template-syntax errors; callers decide how to surface that.
export const compileResumeHtml = (htmlLayout: string, data: any): string => {
  const compiled = hbs.compile(htmlLayout);
  return compiled(data ?? {});
};
