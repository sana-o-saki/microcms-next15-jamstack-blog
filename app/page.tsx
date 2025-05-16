// app/page.tsx
import Link from 'next/link';
import { client } from '../libs/microcms';
import styles from './page.module.css';

// 商品の型定義
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

// microCMSからブログ記事を取得
async function getBlogPosts(): Promise<Props[]> {
  const data = await client.get({
    endpoint: 'product', // 'blog'はmicroCMSのエンドポイント名
    queries: {
      fields: 'id,title,image,price,category',  // idとtitleを取得
      limit: 20,  // 最新の5件を取得
    },
  });
  return data.contents;
}

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <main>
      <div className={styles.main}>
        <h1>商品一覧</h1>
        <div className={styles.products}>
          {posts.map((post) => (
              <Link href={`/product/${post.id}`} key={post.id}> {/* Linkコンポーネントを使用、key属性を追加 */}
                {post.image && (
                  <img
                    src={post.image.url}
                    alt={post.title}
                    width={post.image.width}
                    height={post.image.height}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
                <p>{post.title}</p> {/* 商品名を表示 */}
                <p className={styles.category}>{post.category && post.category.name}</p> {/* カテゴリーを表示 */}
                <div className={styles.post} dangerouslySetInnerHTML={{ __html: post.price }} />
              </Link>

          ))}
        </div>
      </div>
    </main>
  );
}