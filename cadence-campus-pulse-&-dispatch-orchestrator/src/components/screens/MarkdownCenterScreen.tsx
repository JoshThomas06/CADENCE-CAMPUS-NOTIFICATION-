import React, { useState } from 'react';
import { MARKDOWN_FILES, MarkdownFile } from '../../data/markdownFiles';
import { downloadSingleFile, downloadAllAsZip } from '../../utils/downloader';
import {
  Download,
  Copy,
  Check,
  FileText,
  Archive,
  Layers,
  Code,
  Eye,
  CheckCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { playAlertChime } from '../../utils/sound';

interface MarkdownCenterScreenProps {
  onOpenViewer: (fileId: string) => void;
  soundEnabled: boolean;
}

export const MarkdownCenterScreen: React.FC<MarkdownCenterScreenProps> = ({
  onOpenViewer,
  soundEnabled
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(MARKDOWN_FILES[0].id);

  const handleCopy = (file: MarkdownFile) => {
    navigator.clipboard.writeText(file.content);
    setCopiedId(file.id);
    if (soundEnabled) playAlertChime('info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadAll = async () => {
    setIsZipping(true);
    if (soundEnabled) playAlertChime('success');
    try {
      await downloadAllAsZip();
    } finally {
      setIsZipping(false);
    }
  };

  const currentFile = MARKDOWN_FILES.find(f => f.id === activeTab) || MARKDOWN_FILES[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#003643] via-[#1b4d5c] to-[#0E2D36] text-white p-8 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ffdeae] font-bold">
              Engineering Specs &amp; UI Screen Archive
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Downloadable Screen Markdown Files
            </h1>
            <p className="text-sm sm:text-base text-[#8ebdce] leading-relaxed mt-1">
              Every screen from Cadence Campus Pulse exported in clean, formatted Markdown with complete architectural specs, CloudEvents payloads, color variables, and hotlinked artwork.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={isZipping}
            className="px-6 py-3.5 rounded-2xl bg-[#D99B26] hover:bg-[#c2881e] text-[#001f28] font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 flex-shrink-0 self-start md:self-auto"
          >
            <Archive className="w-5 h-5" />
            <span>{isZipping ? 'Generating ZIP...' : 'Download All as ZIP Archive (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Downloadable Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MARKDOWN_FILES.map(file => (
          <div
            key={file.id}
            className={`rounded-2xl p-6 transition-all flex flex-col justify-between border ${
              activeTab === file.id
                ? 'bg-white border-[#003643] shadow-md ring-2 ring-[#003643]/20'
                : 'bg-white/80 border-[#DCE5E7] hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#C2593F]">
                  {file.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F0F5F6] text-[#003643] font-mono text-[10px] font-semibold border border-[#DCE5E7]">
                  {file.filename}
                </span>
              </div>

              <h3 className="font-editorial text-xl font-bold text-[#003643]">
                {file.title}
              </h3>
              <p className="text-xs text-[#41484b] leading-relaxed">
                {file.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#DCE5E7] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveTab(file.id)}
                className="text-xs font-mono font-semibold text-[#003643] hover:underline flex items-center gap-1"
              >
                <span>Inspect</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(file)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#DCE5E7] hover:bg-[#F0F5F6] text-[#003643] text-xs font-mono transition flex items-center gap-1"
                  title="Copy markdown"
                >
                  {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === file.id ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadSingleFile(file)}
                  className="px-3 py-1.5 rounded-lg bg-[#003643] hover:bg-[#0E2D36] text-white text-xs font-mono font-semibold transition flex items-center gap-1.5 shadow-sm"
                  title="Download .md file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected File Live Preview Console */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F5F6] flex items-center justify-center text-[#003643]">
              <Code className="w-5 h-5 text-[#D99B26]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-2xl font-bold text-[#003643]">
                  {currentFile.filename}
                </h2>
                <span className="font-mono text-xs text-[#71787c]">
                  ({currentFile.screenType})
                </span>
              </div>
              <p className="text-xs text-[#71787c]">{currentFile.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenViewer(currentFile.id)}
              className="px-3.5 py-2 rounded-xl bg-[#F0F5F6] hover:bg-[#dbebf1] text-[#003643] text-xs font-mono font-semibold transition border border-[#DCE5E7] flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Screen Reader</span>
            </button>
            <button
              type="button"
              onClick={() => downloadSingleFile(currentFile)}
              className="px-4 py-2 rounded-xl bg-[#C2593F] hover:bg-[#a04028] text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download {currentFile.filename}</span>
            </button>
          </div>
        </div>

        {/* Markdown Source Preview Box */}
        <pre className="font-mono text-xs leading-relaxed text-[#0f1e22] bg-[#FBF9F4] p-6 rounded-2xl border border-[#DCE5E7] max-h-[500px] overflow-y-auto whitespace-pre-wrap select-all shadow-inner">
          {currentFile.content}
        </pre>
      </div>
    </div>
  );
};
