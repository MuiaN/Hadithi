'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

export interface Chapter {
  id: string;
  title: string;
  content: string;
  subChapters: Chapter[];
}

interface ChapterManagerProps {
  chapters: Chapter[];
  onChange: (chapters: Chapter[]) => void;
}

export default function ChapterManager({ chapters, onChange }: ChapterManagerProps) {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      subChapters: []
    };
    onChange([...chapters, newChapter]);
    setExpandedChapters(prev => ({ ...prev, [newChapter.id]: true }));
  };

  const updateChapter = (id: string, field: keyof Chapter, value: any) => {
    const updateRecursive = (list: Chapter[]): Chapter[] => {
      return list.map(ch => {
        if (ch.id === id) {
          return { ...ch, [field]: value };
        }
        if (ch.subChapters.length > 0) {
          return { ...ch, subChapters: updateRecursive(ch.subChapters) };
        }
        return ch;
      });
    };
    onChange(updateRecursive(chapters));
  };

  const addSubChapter = (parentId: string) => {
    const updateRecursive = (list: Chapter[]): Chapter[] => {
      return list.map(ch => {
        if (ch.id === parentId) {
          const newSub: Chapter = {
            id: crypto.randomUUID(),
            title: '',
            content: '',
            subChapters: []
          };
          // Auto expand the parent to show the new child
          setExpandedChapters(prev => ({ ...prev, [parentId]: true, [newSub.id]: true }));
          return { ...ch, subChapters: [...ch.subChapters, newSub] };
        }
        if (ch.subChapters.length > 0) {
          return { ...ch, subChapters: updateRecursive(ch.subChapters) };
        }
        return ch;
      });
    };
    onChange(updateRecursive(chapters));
  };

  const removeChapter = (id: string) => {
    const removeRecursive = (list: Chapter[]): Chapter[] => {
      return list.filter(ch => ch.id !== id).map(ch => ({
        ...ch,
        subChapters: removeRecursive(ch.subChapters)
      }));
    };
    onChange(removeRecursive(chapters));
  };

  const renderChapter = (chapter: Chapter, index: number, parentIndexStr: string = '') => {
    const numbering = parentIndexStr ? `${parentIndexStr}.${index + 1}` : `${index + 1}`;
    const isExpanded = expandedChapters[chapter.id];
    const nextSubChapterNumber = `${numbering}.${chapter.subChapters.length + 1}`;

    return (
      <div key={chapter.id} className="border rounded-lg mb-4 bg-[var(--color-card)] border-[var(--color-border)]">
        <div className="flex items-center p-4 gap-2 bg-[var(--color-backgroundSecondary)] rounded-t-lg">
          <button type="button" onClick={() => toggleExpand(chapter.id)} className="p-1 hover:bg-[var(--color-backgroundTertiary)] rounded text-[var(--color-textPrimary)]">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="font-mono text-sm font-bold text-[var(--color-textSecondary)]">{numbering}</span>
          <Input
            value={chapter.title}
            onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
            placeholder={`Chapter Title`}
            className="flex-1 h-9 bg-[var(--color-input)] border-[var(--color-inputBorder)] text-[var(--color-textPrimary)]"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeChapter(chapter.id)}
            className="text-red-500 hover:bg-red-500/10"
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {isExpanded && (
          <div className="p-4 space-y-4">
            <div>
              <Label className="mb-2 block text-xs uppercase text-[var(--color-textSecondary)]">Content</Label>
              <RichTextEditor
                value={chapter.content}
                onChange={(val) => updateChapter(chapter.id, 'content', val)}
                folderName={`book-chapter-${chapter.id}`}
              />
            </div>

            {/* Subchapters */}
            <div className="pl-4 border-l-2 border-[var(--color-border)]">
              {chapter.subChapters.map((sub, idx) => renderChapter(sub, idx, numbering))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSubChapter(chapter.id)}
                className="mt-2 text-[var(--color-textPrimary)] border-[var(--color-border)] hover:bg-[var(--color-backgroundSecondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Plus size={14} className="mr-1" /> Add Sub-chapter {nextSubChapterNumber}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => renderChapter(chapter, index))}
      <Button
        type="button"
        onClick={addChapter}
        className="w-3/4 mx-auto flex py-6 border-2 bg-[var(--color-backgroundSecondary)] hover:bg-[var(--color-backgroundTertiary)] border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-textPrimary)] hover:text-[var(--color-primary)] transition-colors"
        variant="outline"
      >
        <Plus size={20} className="mr-2" /> Add Chapter {chapters.length + 1}
      </Button>
    </div>
  );
}
