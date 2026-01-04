'use client';

import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

export default function RichTextEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
}: RichTextEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState(false);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== content) {
      contentRef.current.innerHTML = convertMarkdownToHtml(content);
    }
  }, [content]);

  const handleContentInput = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      const markdown = convertHtmlToMarkdown(html);
      onContentChange(markdown);
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    setSelectedText(!!selection && selection.toString().length > 0);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    const newText = prefix + selectedText + suffix;
    document.execCommand('insertText', false, newText);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="文章标题..."
        className="w-full text-5xl font-bold border-none outline-none mb-8 placeholder:text-gray-300"
      />

      {/* Floating Toolbar */}
      {selectedText && (
        <div className="fixed bg-gray-900 text-white rounded-lg shadow-lg p-2 flex gap-1 z-50">
          <button
            onClick={() => insertMarkdown('**', '**')}
            className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors"
            title="加粗"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertMarkdown('*', '*')}
            className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors"
            title="斜体"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => insertMarkdown('[', '](url)')}
            className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors"
            title="链接"
          >
            🔗
          </button>
          <div className="w-px bg-gray-600 mx-1" />
          <button
            onClick={() => insertMarkdown('## ', '')}
            className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors"
            title="H2标题"
          >
            H2
          </button>
          <button
            onClick={() => insertMarkdown('### ', '')}
            className="px-3 py-1.5 hover:bg-gray-700 rounded transition-colors"
            title="H3标题"
          >
            H3
          </button>
        </div>
      )}

      {/* Content Editor */}
      <div
        ref={contentRef}
        contentEditable
        onInput={handleContentInput}
        onSelect={handleSelection}
        className="min-h-[600px] outline-none prose prose-lg max-w-none"
        suppressContentEditableWarning
        placeholder="开始写作..."
      />

      {/* Quick Insert Menu */}
      <div className="mt-6 p-4 border-t">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const img = '\n\n![图片描述](image-url.jpg)\n\n';
              onContentChange(content + img);
            }}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
          >
            🖼️ 插入图片
          </button>
          <button
            onClick={() => {
              const list = '\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n';
              onContentChange(content + list);
            }}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
          >
            📋 插入列表
          </button>
          <button
            onClick={() => {
              const quote = '\n\n> 引用文字\n\n';
              onContentChange(content + quote);
            }}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
          >
            💬 插入引用
          </button>
          <button
            onClick={() => {
              const code = '\n\n```\n代码块\n```\n\n';
              onContentChange(content + code);
            }}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
          >
            💻 插入代码
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for Markdown conversion
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Bold and Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Lists
  html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  return html;
}

function convertHtmlToMarkdown(html: string): string {
  let markdown = html;

  // Headers
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n');

  // Bold and Italic
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');

  // Links
  markdown = markdown.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '[$2]($1)');

  // Images
  markdown = markdown.replace(/<img src="([^"]+)" alt="([^"]*)" \/>/g, '![$2]($1)');

  // Lists
  markdown = markdown.replace(/<li>(.*?)<\/li>/g, '- $1\n');
  markdown = markdown.replace(/<ul>|<\/ul>/g, '');

  // Paragraphs
  markdown = markdown.replace(/<p>|<\/p>/g, '\n\n');

  // Clean up
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}
