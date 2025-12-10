"use client";
import React from 'react';
import useSWR from 'swr';
import { fetchNews, NewsItem } from '@/lib/cryptoApi';
import { ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const NewsFeed = () => {
    const { data: news, error, isLoading } = useSWR<NewsItem[]>('crypto-news', fetchNews, {
        refreshInterval: 60000 // Refresh every minute
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-[#444]">
                <Loader2 className="animate-spin" size={20} />
            </div>
        );
    }

    if (error || !news || news.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-[#444] text-xs px-4 text-center">
                Unable to load news feed.
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar">
            {news.slice(0, 20).map((item) => (
                <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] text-neon-green font-bold uppercase truncate max-w-[120px]">
                            {item.source}
                        </span>
                        <span className="text-[10px] text-[#666] whitespace-nowrap ml-2">
                            {formatDistanceToNow(item.published_on * 1000, { addSuffix: true }).replace("about ", "")}
                        </span>
                    </div>
                    <h4 className="text-xs font-medium text-[#eaeaea] leading-snug group-hover:text-white mb-2 line-clamp-3">
                        {item.title}
                    </h4>
                    <div className="flex justify-between items-end mt-1">
                        <div className="flex gap-1 flex-wrap">
                            {item.categories.split("|").slice(0, 2).map((cat, i) => (
                                <span key={i} className="text-[9px] text-[#555] bg-[#111] px-1 py-0.5 rounded border border-[#222]">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <ExternalLink size={10} className="text-[#666] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </a>
            ))}
        </div>
    );
};
