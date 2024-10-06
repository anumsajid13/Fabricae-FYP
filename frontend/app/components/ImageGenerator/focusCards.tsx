import { FocusCards } from "../ui/focus-cards";

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Forest Adventure",
      src: "/Forest Adventure.avif",
    },
    {
      title: "Valley of life",
      src: "/Valley of life.jpg",
    },
    {
      title: "Sala behta hi jayega",
      src: "/Sala behta hi jayega.jpg",
    },
    {
      title: "Camping is for pros",
      src: "/Camping is for pros.jpg",
    },
    {
      title: "The road not taken",
      src: "/The road not taken.avif",
    },
    {
      title: "The First Rule",
      src: "/The First Rule.jpg",
    },
  ];

  return <FocusCards cards={cards} />;
}
