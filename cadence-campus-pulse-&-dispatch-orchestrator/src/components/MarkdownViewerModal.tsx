import React, { useState } from 'react';
import { MARKDOWN_FILES, MarkdownFile } from '../data/markdownFiles';
import { downloadSingleFile, downloadAllAsZip } from '../utils/downloader';
import { Download, Copy, Check, FileText, Archive, X, Eye, Code } from 'lucide-react';

interface MarkdownViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFileId?: string;
}

export const MarkdownViewerModal: React.FC<MarkdownViewerModalProps> = ({
  isOpen,
  onClose,
  initialFileId = '01-live-stream-alerts.md'
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    initialFileId || MARKDOWN_FILES[0].id
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  if (!isOpen) return null;

  const currentFile =
    MARKDOWN_FILES.find(f => f.id === selectedFileId || f.filename === selectedFileId) ||
    MARKDOWN_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      await downloadAllAsZip();
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0E2D36]/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-[#DCE5E7] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0E2D36] text-white border-b border-[#1b4d5c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1b4d5c] flex items-center justify-center text-[#ffdeae] font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl font-bold text-white tracking-wide">
                  Downloadable Screen Markdown Files
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D99B26]/20 text-[#ffdeae] text-xs font-mono">
                  {MARKDOWN_FILES.length} Files
                </span>
              </div>
              <p className="text-xs text-[#8ebdce] font-sans">
                Comprehensive architecture, screen layouts, tokens, and data payloads ready for documentation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              disabled={isZipping}
              className="px-3.5 py-2 rounded-lg bg-[#D99B26] hover:bg-[#c2881e] text-[#001f28] font-semibold text-xs transition flex items-center gap-2 shadow-sm"
              title="Download all files in a single zip archive"
            >
              <Archive className="w-4 h-4" />
              <span>{isZipping ? 'Bundling ZIP...' : 'Download All (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8ebdce] hover:text-white hover:bg-white/10 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FBF9F4]">
          {/* Left Sidebar: File Tabs */}
          <div className="w-full md:w-72 bg-[#F0F5F6] border-r border-[#DCE5E7] p-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
            <div className="hidden md:block px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-[#71787c] font-semibold">
              Available Screen MDs
            </div>
            {MARKDOWN_FILES.map(file => {
              const isSelected = file.id === currentFile.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`flex-shrink-0 md:w-full text-left p-2.5 rounded-xl transition flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-white border-[#1b4d5c] shadow-sm text-[#003643]'
                      : 'border-transparent text-[#41484b] hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold truncate">{file.filename}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected
                          ? 'bg-[#1b4d5c] text-white'
                          : 'bg-[#DCE5E7] text-[#41484b]'
                      }`}
                    >
                      {file.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#71787c] truncate hidden md:block">
                    {file.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Area: File Content & Actions */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-[#DCE5E7] bg-white">
              <div>
                <span className="font-mono text-sm font-bold text-[#003643]">
                  {currentFile.filename}
                </span>
                <span className="mx-2 text-[#c0c8cb]">•</span>
                <span className="text-xs text-[#71787c] font-sans">
                  {currentFile.description}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-[#F0F5F6] p-0.5 border border-[#DCE5E7]">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition ${
                      viewMode === 'preview'
                        ? 'bg-white text-[#003643] shadow-xs font-semibold'
                        : 'text-[#71787c] hover:text-[#003643]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Formatted</span>
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition ${
                      viewMode === 'raw'
                        ? 'bg-white text-[#003643] shadow-xs font-semibold'
                        : 'text-[#71787c] hover:text-[#003643]'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Raw Markdown</span>
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE5E7] hover:bg-[#F0F5F6] text-[#003643] text-xs font-medium transition flex items-center gap-1.5"
                  title="Copy markdown content to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => downloadSingleFile(currentFile)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1b4d5c] hover:bg-[#003643] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                  title="Download this markdown file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FBF9F4]">
              {viewMode === 'raw' ? (
                <pre className="font-mono text-xs text-[#0f1e22] leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-[#DCE5E7] shadow-inner select-all">
                  {currentFile.content}
                </pre>
              ) : (
                <div className="prose prose-slate max-w-none text-[#0f1e22] bg-white p-6 sm:p-8 rounded-xl border border-[#DCE5E7] shadow-sm">
                  {/* Clean Formatted Rendering */}
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#DCE5E7]">
                    <span className="w-3 h-3 rounded-full bg-[#C2593F]"></span>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#71787c]">
                      Screen Specification Document: {currentFile.filename}
                    </span>
                  </div>

                  <pre className="font-mono text-xs bg-[#0E2D36] text-[#ffdeae] p-4 rounded-lg overflow-x-auto my-4 whitespace-pre-wrap">
                    {currentFile.content.slice(0, 1400)}
                    {currentFile.content.length > 1400 && '\n\n... [Click "Raw Markdown" or "Download .md" to view complete text]'}
                  </pre>

                  <div className="mt-6 p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex items-center justify-between">
                    <div>
                      <div className="font-editorial text-base font-bold text-[#003643]">
                        {currentFile.title}
                      </div>
                      <div className="text-xs text-[#71787c]">
                        Ready for inclusion in developer portals, student handbooks, and faculty SOPs.
                      </div>
                    </div>
                    <button
                      onClick={() => downloadSingleFile(currentFile)}
                      className="px-4 py-2 rounded-lg bg-[#C2593F] hover:bg-[#a04028] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download {currentFile.filename}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
