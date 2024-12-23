import BookItem from "@/components/book-item";
import BookItemSkeleton from "@/components/skeleton/book-item-skeleton";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";
import { delay } from "@/util/delay";
import { Metadata } from "next";
import { Suspense } from "react";

async function SearchResult({ q }: { q: string }) {
    await delay(1500);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`, {
        cache: "force-cache",
    });
    if (!response.ok) {
        return <div>오류가 발생했습니다.</div>;
    }

    const books: BookData[] = await response.json();

    return (
        <div>
            {books.map((book) => (
                <BookItem key={book.id} {...book} />
            ))}
        </div>
    );
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
    // 현재 페이지 메타데이터를 동적으로 생성하는 역할
    const { q } = await searchParams;
    return {
        title: `${q} : 한입북스 검색`,
        description: `${q}의 검색 결과입니다.`,
        openGraph: {
            title: `${q} : 한입북스 검색`,
            description: `${q}의 검색 결과입니다.`,
            images: ["/thumbnail.png"],
        },
    };
}

export default function Page({
    searchParams,
}: {
    searchParams: {
        q?: string;
    };
}) {
    return (
        <Suspense key={searchParams.q || ""} fallback={<BookListSkeleton count={3} />}>
            <SearchResult q={searchParams.q || ""} />
        </Suspense>
    );
}
