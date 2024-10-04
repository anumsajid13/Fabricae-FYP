import { FocusCards } from "../ui/focus-cards";

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Forest Adventure",
      src: "https://img.freepik.com/premium-photo/floral-seamless-repeat-pattern-design-flowers-textile-design-fabric-printing-generative-ai_467123-22874.jpg",
    },
    {
      title: "Valley of life",
      src: "https://patternobserver.com/wp-content/uploads/2015/03/Damask-scaled.jpg",
    },
    {
      title: "Sala behta hi jayega",
      src: "https://cdn.dribbble.com/users/3824937/screenshots/13798135/media/d4e6a2b38943f4cb015bd35f8413e9b3.jpg?resize=400x0",
    },
    {
      title: "Camping is for pros",
      src: "https://cdn.dribbble.com/userupload/3588295/file/original-03b8f221c1cf632466dd8a6df4d40576.jpg?resize=400x0",
    },
    {
      title: "The road not taken",
      src: "https://img.freepik.com/premium-photo/japanese-dye-black-batik-fabric-effect-banner-swatch-with-denim-blue-leaf-motif-seamless-border_717906-77173.jpg",
    },
    {
      title: "The First Rule",
      src: "https://blog.fabrics-store.com/wp-content/uploads/2020/11/Popova_feature.jpg",
    },
  ];

  return <FocusCards cards={cards} />;
}
