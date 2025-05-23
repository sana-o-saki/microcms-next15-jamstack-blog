// app/blog/[id]/page.tsx
import { client } from '../../../libs/microcms';
import styles from './page.module.css';
import logoImage from '../../..//img/logo.png';
// import dayjs from 'dayjs';

// 製品の定義
type Props = {
  id: string;
  title: string;
  category: { name: string };
  price: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
};

// microCMSから特定の製品情報を取得
async function getBlogPost(id: string): Promise<Props> {
  const data = await client.get({
    endpoint: `product/${id}`,
  });
  return data;
}

// 製品詳細ページの生成
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // IDを取得
  const post = await getBlogPost(id);
  const priceWithTax = `¥ ${post.price} (税込)`;

  // dayjsを使ってpublishedAtをYY.MM.DD形式に変換
  //   const formattedDate = dayjs(post.publishedAt).format('YY.MM.DD');

  return (
    <main className={styles.main}>
      <div className={styles.mainInr}>
        <div>
          <svg width="150" height="150" className={styles.logo}>
            <image href={logoImage.src} x="0" y="0" height="100%" width="100%" />
          </svg>
        </div>
        <div className={styles.flex}>
          {post.image && (
            <img
              src={post.image.url}
              alt={post.title} // alt属性はアクセシビリティのために重要です
              width={post.image.width} // 必要に応じてwidthを指定
              height={post.image.height} // 必要に応じてheightを指定
              style={{ maxWidth: '100%', height: 'auto' }} // レスポンシブ対応
            />
          )}
          <div className={styles.item}>
            <h1 className={styles.title}>{post.title}</h1> {/* タイトルを表示 */}
            {/* <div className={styles.category}>カテゴリー：{post.category && post.category.name}</div> */}
            <div className={styles.price} dangerouslySetInnerHTML={{ __html: priceWithTax }} />
          </div>
          <button className={styles.btn}>カートに入れる</button>
        </div>
      </div>
    </main>
  );
}

// 静的パスを生成
export async function generateStaticParams() {
  const contentIds = await client.getAllContentIds({ endpoint: 'product' });

  return contentIds.map((contentId) => ({
    id: contentId, // 各記事のIDをパラメータとして返す
  }));
}