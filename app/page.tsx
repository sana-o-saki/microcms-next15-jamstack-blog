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
    <main className={styles.main}>
      <div className={styles.mainInr}>
        <div>
          <p>Style Select</p>
        </div>
        <h1 className={styles.mainInrTitle}>商品一覧</h1>
        <div className={styles.products}>
        {posts.map((post) => {
            const priceWithTax = `¥ ${post.price} (税込)`;

            return (
              <Link href={`/product/${post.id}`} key={post.id} className={styles.productItem}>
                {post.image && (
                  <img
                    src={post.image.url}
                    alt={post.title}
                    width={post.image.width}
                    height={post.image.height}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
                <p className={styles.title} >{post.title}</p>
                <div className={styles.price} dangerouslySetInnerHTML={{ __html: priceWithTax }} />
              </Link>
            );
          })}

        </div>
      </div>
    </main>
  );
}