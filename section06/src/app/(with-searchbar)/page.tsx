import BookItem from "@/components/book-item";
import style from "./page.module.css";
import books from "@/mock/books.json";
import { BookData } from "@/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

async function AllBooks() {
    await delay(1500);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`, { cache: "no-store" });
    if (!response.ok) {
        return <div>오류가 발생했습니다!</div>;
    }
    const allBooks: BookData[] = await response.json();

    return (
        <div>
            {allBooks.map((book) => (
                <BookItem key={book.id} {...book} />
            ))}
        </div>
    );
}

async function RecoBooks() {
    await delay(3000);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`, {
        next: { revalidate: 3 },
    });
    if (!response.ok) {
        return <div>오류가 발생했습니다...</div>;
    }

    const recoBooks: BookData[] = await response.json();
    return (
        <div>
            {recoBooks.map((book) => (
                <BookItem key={book.id} {...book} />
            ))}
        </div>
    );
}

export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <div className={style.container}>
            <section>
                <h3>지금 추천하는 도서</h3>
                <Suspense fallback={<div>도서를 불러오는 중입니다... </div>}>
                    <RecoBooks />
                </Suspense>
            </section>
            <section>
                <h3>등록된 모든 도서</h3>
                <Suspense fallback={<div>도서를 불러오는 중입니다... </div>}>
                    <AllBooks />
                </Suspense>
            </section>
        </div>
    );
}
