import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('@/components/model-viewer'), { ssr: false });

export const revalidate = 60;

type PageProps = {
  params: { slug: string };
};

export default async function Page({ params }: PageProps) {
  const query = groq`*[_type == "page" && slug.current == $slug][0]{
    title,
    modelFolder
  }`;
  const page = await client.fetch(query, { slug: params.slug });

  if (!page) return <div>Not found</div>;

  const modelUrl = `/models/${page.modelFolder}/Tapware.gltf`;

  return (
    <div>
      <h1>{page.title}</h1>
      <ModelViewer modelUrl={modelUrl} />
    </div>
  );
}
