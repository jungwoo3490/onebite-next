import { ReviewData } from "@/types";
import style from "./page.module.css";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editior";

export function generateStaticParams() {
    return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

async function BookDetail({ bookId }: { bookId: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`, { cache: "force-cache" });

    if (!response.ok) {
        return <div>오류가 발생했습니다!!</div>;
    }

    const book = await response.json();

    const { title, subTitle, description, author, publisher, coverImgUrl } = book;

    return (
        <section>
            <div className={style.cover_img_container} style={{ backgroundImage: `url('${coverImgUrl}')` }}>
                <img src={coverImgUrl} />
            </div>
            <div className={style.title}>{title}</div>
            <div className={style.subTitle}>{subTitle}</div>
            <div className={style.author}>
                {author} | {publisher}
            </div>
            <div className={style.description}>{description}</div>
        </section>
    );
}

async function ReviewList({ bookId }: { bookId: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`, {
        next: { tags: [`review-${bookId}`] },
    });

    if (!response.ok) {
        throw new Error(`Review fetch failed : ${response.statusText}`);
    }

    const reviews: ReviewData[] = await response.json();

    return (
        <section>
            {reviews.map((review) => (
                <ReviewItem key={`review-item-${review.id}`} {...review} />
            ))}
        </section>
    );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className={style.container}>
            <BookDetail bookId={(await params).id} />
            <ReviewEditor bookId={(await params).id} />
            <ReviewList bookId={(await params).id} />
        </div>
    );
}
