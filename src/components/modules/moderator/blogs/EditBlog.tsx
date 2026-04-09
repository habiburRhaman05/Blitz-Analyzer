"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, CheckCircle2, ChevronDown, Loader, RefreshCw } from "lucide-react";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    Sparkles,
    Save,
    Send,
    X,
    Loader2,
    Tag,
    AlignLeft,
    Type,
    Users,
    Wand2,
    Eye,
    Upload,
    Image as ImageIcon,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Highlighter,
    Palette,
    Undo,
    Redo,
} from "lucide-react";

// --- TipTap Imports ---
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { handleAvatarUpload } from "@/services/auth.services";
import { toast } from "sonner";
import { createBlog } from "@/services/blog.services";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// --- Types (optional, for clarity) ---
interface FormData {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    fullContent: string;
    seoTags: string[];
    thumbnail?: string | null;
}

export default function EditBlogPage({id}) {
    // --- Form State ---
    const [formData, setFormData] = useState<FormData>({
        title: "",
        slug: "",
        category: "",
        excerpt: "",
        fullContent: "",
        seoTags: [],
        thumbnail: null,
    });


    const { data, isLoading } = useApiQuery(["fetch-blogs"], `/blog/${id}`, "axios");



    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);
    const [actionType, setActionType] = useState<"draft" | "publish" | "update" | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- TipTap Editor Setup ---
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            UnderlineExtension,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content: formData.fullContent,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setFormData((prev) => ({ ...prev, fullContent: html }));
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none p-6 min-h-[400px] focus:outline-none",
            },
        },
        immediatelyRender: false
    });

    // Sync editor content when AI generation updates fullContent
    React.useEffect(() => {
        if (editor && formData.fullContent !== editor.getHTML()) {
            editor.commands.setContent(formData.fullContent);
        }
    }, [formData.fullContent, editor]);

    // --- Handlers ---
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            e.preventDefault();
            setFormData((prev) => ({
                ...prev,
                seoTags: [...prev.seoTags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const removeTag = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            seoTags: prev.seoTags.filter((_, index) => index !== indexToRemove),
        }));
    };

    // --- Thumbnail Upload (with dummy delay) ---
    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true)


        // Show preview immediately
        // Simulate upload delay

        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        try {
            // Fetching the preview/temp URL from your API
            const response = await handleAvatarUpload(formData)
            console.log(response);

            setFormData((prev) => ({ ...prev, thumbnail: response.data.data.secure_url }));

            setThumbnailPreview(response.data.data.secure_url);
            setIsUploading(false)
        } catch (error) {
            toast.error("Failed to process image");
            setThumbnailPreview(null)
        }

    };

    const clearThumbnail = () => {
        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
        setFormData((prev) => ({ ...prev, thumbnail: null }));
    };

    const handlePublish = () => {
        console.log(formData);

    }




    // --- Toolbar Component (inline for simplicity) ---
    const MenuBar = ({ editor }: { editor: Editor | null }) => {
        if (!editor) return null;

        return (
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
                {/* Text Style Buttons */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("bold") ? "bg-accent text-accent-foreground" : ""
                        }`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("italic") ? "bg-accent text-accent-foreground" : ""
                        }`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("underline") ? "bg-accent text-accent-foreground" : ""
                        }`}
                    title="Underline"
                >
                    <Underline className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("heading", { level: 1 })
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }`}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("heading", { level: 2 })
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }`}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("bulletList") ? "bg-accent text-accent-foreground" : ""
                        }`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("orderedList") ? "bg-accent text-accent-foreground" : ""
                        }`}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Color & Highlight */}
                <div className="relative group">
                    <button className="p-2 rounded hover:bg-accent" title="Text Color">
                        <Palette className="w-4 h-4" />
                    </button>
                    <input
                        type="color"
                        onInput={(e) =>
                            editor.chain().focus().setColor(e.currentTarget.value).run()
                        }
                        value={editor.getAttributes("textStyle").color || "#000000"}
                        className="absolute top-full left-0 mt-1 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    />
                </div>
                <button
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={`p-2 rounded hover:bg-accent ${editor.isActive("highlight") ? "bg-accent text-accent-foreground" : ""
                        }`}
                    title="Highlight"
                >
                    <Highlighter className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-accent disabled:opacity-40"
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-accent disabled:opacity-40"
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </button>

                <div className="flex-1" />
                <span className="text-xs text-muted-foreground">
                    Use Markdown shortcuts (e.g., **bold**)
                </span>
            </div>
        );
    };


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // update state after fetch data
    useEffect(() => {
        if (data?.data) {
            const blogInfo = data?.data
            console.log(blogInfo);
            
        setFormData({
                title:  blogInfo.title ||"",
        slug:  blogInfo.slug ||"",
        category:  blogInfo.category ||"",
        excerpt:  blogInfo.excerpt ||"",
        fullContent:  blogInfo.fullContent ||"",
        seoTags: blogInfo.seoTags || [],
        thumbnail: blogInfo.thumbnail || "",
        })
        }
    }, [data,isLoading]);

    const updatehmutation = useApiMutation({
        actionName: "sfsdf",
        actionType: "SERVER_SIDE",
        method: "PATCH",
        endpoint: `/blog/${id}`
    })

    const handleAction = async (type: "DRAFT" | "PUBLISHED") => {
        setIsMenuOpen(false); // Close menu first
        setActionType("update");
        setGlobalLoading(true);

        console.log();

        try {
            // Your Tanstack Mutation or API call logic here
            const result = await updatehmutation.mutateAsync({ ...formData, status: type.toUpperCase() })
      
               setFormData({
                title:  result.data.title ||"",
        slug:  result.data.slug ||"",
        category:  result.data.category ||"",
        excerpt:  result.data.excerpt ||"",
        fullContent:  result.data.fullContent ||"",
        seoTags: result.data.seoTags || [],
        thumbnail: result.data.thumbnail || "",
        })
            
        } catch (error) {
            console.error(error);
        } finally {
            setGlobalLoading(false);
            setActionType(null);
        }
    };

   if (isLoading) {
    return (
        <div className="min-h-screen bg-background p-6 md:p-10 font-sans">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="space-y-3">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-12 w-3/4" />
                    <div className="border border-border rounded-xl overflow-hidden">
                        <Skeleton className="h-12 w-full rounded-none border-b" /> {/* Toolbar */}
                        <div className="p-6 space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-40 w-full mt-8" />
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-6">
                    {/* Image Card */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="aspect-video w-full rounded-lg" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    {/* Details Card */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                        <Skeleton className="h-6 w-32" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-10 font-sans">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
                    <p className="text-muted-foreground text-sm mt-1 text-balance">
                        Draft your content manually or use our AI assistant to generate a
                        high-quality article.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAiModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-md text-sm font-medium transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                    </button>
                    <button
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                     <Button

                     disabled={updatehmutation.isPending}
                                            onClick={() => handleAction("PUBLISHED")}
                                            className=" flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors group"
                                        >
                                         {updatehmutation.isPending ? <>
                                            <Loader className="w-4 h-4 group-hover:text-primary transition-colors animate-spin" />
                                            <div className="text-left">
                                                <p className="text-foreground">Save Changing</p>
                                            </div>
                                         </> : <>   <Send className="w-4 h-4 group-hover:text-primary transition-colors" />
                                            <div className="text-left">
                                                <p className="text-foreground">Save Changes</p>
                                            </div></>}
                                        </Button>
                </div>
            </header>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-1">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Post Title..."
                            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground focus:ring-0"
                        />
                    </div>

                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>
                </div>

                {/* Right Column: Metadata Sidebar */}
                <div className="space-y-6">
                    {/* Thumbnail Upload Card */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-lg border-b border-border pb-3">
                            Featured Image
                        </h3>
                        <div className="flex flex-col items-center gap-3">
                            {thumbnailPreview || formData.thumbnail ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={thumbnailPreview || formData.thumbnail || ""}
                                        alt="Thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={clearThumbnail}
                                        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full aspect-video bg-muted/30 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                                    <ImageIcon className="w-10 h-10 mb-2" />
                                    <span className="text-sm">No image selected</span>
                                </div>
                            )}

                            <label className="w-full cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <div className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Upload Thumbnail
                                        </>
                                    )}
                                </div>
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Recommended: 1200×630px (16:9)
                            </p>
                        </div>
                    </div>

                    {/* Post Details Card */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
                        <h3 className="font-semibold text-lg border-b border-border pb-3">
                            Post Details
                        </h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                URL Slug
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                placeholder="my-awesome-post"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="e.g. Career, Tech"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Excerpt
                            </label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="A brief summary for the blog card..."
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                SEO Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.seoTags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(idx)}
                                            className="hover:text-primary/70"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Press Enter to add tag"
                                    className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Generation Modal */}
            {isAiModalOpen && (
                <AiGenerationModal
                    onClose={() => setIsAiModalOpen(false)}
                    onSuccess={(aiData) => {
                        setFormData({
                            title: aiData.title,
                            slug: aiData.slug,
                            excerpt: aiData.excerpt,
                            fullContent: aiData.full_content,
                            seoTags: aiData.seo_tags,
                            category: aiData.category || "AI Generated",
                            thumbnail: formData.thumbnail,
                        });
                    }}
                />
            )}

            {/* Preview Modal */}
            {isPreviewModalOpen && (
                <PreviewModal
                    onClose={() => setIsPreviewModalOpen(false)}
                    data={formData}
                />
            )}

            <GlobalLoader isLoading={globalLoading} type={actionType} />
        </div>
    );
}


// AI GENERATION MODAL (unchanged except minor)

function AiGenerationModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: (data: any) => void;
}) {
    const [aiInput, setAiInput] = useState({
        topic: "",
        target_audience: "junior developers",
        tone: "professional but friendly",
        keywords: "",
        length: "long",
        category: "career",
    });

    const generateMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await fetch(
                "http://localhost:5000/api/v1/generative-ai/generate",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) throw new Error("Failed to generate AI content");
            return response.json();
        },
        onSuccess: (data) => {
            if (data?.output) {
                onSuccess(data.output);
                onClose();
            }
        },
        onError: (error) => {
            console.error("AI Generation Error:", error);
            // Implement toast notification here
        },
    });

    const handleGenerate = () => {
        const payload = {
            mode: "blog",
            context: {
                role: "manager",
                platform: "resume builder SaaS",
                audience_level: "beginner to intermediate",
                brand_voice: "modern, helpful, no fluff",
            },
            data: {
                ...aiInput,
                keywords: aiInput.keywords.split(",").map((k) => k.trim()).filter(Boolean),
            },
        };
        generateMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2 text-primary">
                        <Wand2 className="w-5 h-5" />
                        <h2 className="text-lg font-semibold text-foreground">
                            AI Content Generator
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Type className="w-4 h-4 text-muted-foreground" /> Topic
                        </label>
                        <input
                            type="text"
                            value={aiInput.topic}
                            onChange={(e) => setAiInput({ ...aiInput, topic: e.target.value })}
                            placeholder="e.g. How to create a strong frontend developer portfolio"
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" /> Target Audience
                            </label>
                            <input
                                type="text"
                                value={aiInput.target_audience}
                                onChange={(e) =>
                                    setAiInput({ ...aiInput, target_audience: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Tone</label>
                            <input
                                type="text"
                                value={aiInput.tone}
                                onChange={(e) => setAiInput({ ...aiInput, tone: e.target.value })}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Length</label>
                            <select
                                value={aiInput.length}
                                onChange={(e) => setAiInput({ ...aiInput, length: e.target.value })}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="short">Short</option>
                                <option value="medium">Medium</option>
                                <option value="long">Long</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <input
                                type="text"
                                value={aiInput.category}
                                onChange={(e) =>
                                    setAiInput({ ...aiInput, category: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Tag className="w-4 h-4 text-muted-foreground" /> Keywords (comma
                            separated)
                        </label>
                        <input
                            type="text"
                            value={aiInput.keywords}
                            onChange={(e) => setAiInput({ ...aiInput, keywords: e.target.value })}
                            placeholder="react portfolio, developer projects..."
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-muted/20">
                    <button
                        onClick={onClose}
                        disabled={generateMutation.isPending}
                        className="px-4 py-2 bg-transparent border border-input hover:bg-accent text-foreground rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={generateMutation.isPending || !aiInput.topic}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {generateMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        {generateMutation.isPending ? "Generating..." : "Generate Magic"}
                    </button>
                </div>
            </div>
        </div>
    );
}


// PREVIEW MODAL COMPONENT

function PreviewModal({
    onClose,
    data,
}: {
    onClose: () => void;
    data: FormData;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="bg-card text-card-foreground border border-border w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <h2 className="text-lg font-semibold">Preview: {data.title || "Untitled"}</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Thumbnail */}
                    {data.thumbnail && (
                        <div className="w-full aspect-video rounded-lg overflow-hidden border border-border">
                            <img
                                src={data.thumbnail}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Title & Meta */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{data.title || "Untitled Post"}</h1>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            {data.category && <span>Category: {data.category}</span>}
                            {data.seoTags.length > 0 && (
                                <span>Tags: {data.seoTags.join(", ")}</span>
                            )}
                        </div>
                    </div>

                    {/* Excerpt */}
                    {data.excerpt && (
                        <div className="p-4 bg-muted/30 rounded-lg border border-border italic">
                            {data.excerpt}
                        </div>
                    )}

                    {/* Full Content (rendered HTML) */}
                    <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                        {data.fullContent ? (
                            <div dangerouslySetInnerHTML={{ __html: data.fullContent }} />
                        ) : (
                            <p className="text-muted-foreground">No content yet.</p>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border flex justify-end bg-muted/20">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}


// 1. Updated Interface
interface GlobalLoaderProps {
    isLoading: boolean;
    type: "draft" | "publish" | "update" | null;
}

const GlobalLoader = ({ isLoading, type }: GlobalLoaderProps) => {
    
    // 2. Dynamic Content Configuration
    const loaderConfig = {
        publish: {
            icon: <Send className="w-6 h-6 text-primary animate-pulse" />,
            title: "Publishing Post",
            description: "Making your masterpiece live...",
        },
        draft: {
            icon: <CloudUpload className="w-6 h-6 text-primary animate-pulse" />,
            title: "Saving Draft",
            description: "Syncing with cloud servers...",
        },
        update: {
            icon: <RefreshCw className="w-6 h-6 text-primary animate-pulse" />,
            title: "Updating Post",
            description: "Pushing your latest changes...",
        },
    };

    // Safe fallback if type is null or invalid
    const activeConfig = type ? loaderConfig[type] : loaderConfig.draft;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card border border-border p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-[280px] w-full"
                    >
                        {/* Animated Icon Container */}
                        <div className="relative flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
                            />
                            <div className="absolute">
                                {activeConfig.icon}
                            </div>
                        </div>

                        {/* Dynamic Text */}
                        <div className="text-center">
                            <h3 className="text-lg font-bold tracking-tight">
                                {activeConfig.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {activeConfig.description}
                            </p>
                        </div>

                        {/* Progress dots animation */}
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 bg-primary rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

