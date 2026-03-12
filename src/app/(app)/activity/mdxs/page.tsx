import MDXTitle from './mdx-title.tsx';
import Content from './mdx-content.mdx';
import '@/src/styles/hightlight.css'

const MDXPage = () => {
  return (
    <div>
      <MDXTitle />
      <Content />
    </div>
  );
};

export default MDXPage