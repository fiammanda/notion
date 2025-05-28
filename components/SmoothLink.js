import { useRouter } from 'next/router';

export default function SmoothLink({ href, children, ...props }) {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    document.body.removeAttribute('class');
    document.querySelector('main').ariaHidden = true;
    setTimeout(() => {
      router.push(href);
    }, 200);
  };
  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}