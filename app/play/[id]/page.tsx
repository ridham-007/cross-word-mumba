import PlayArea from "./play-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Play Crossword',
  description: 'Play your selected crossword puzzle',
};
export default function PlayPage() {
  return (
    <PlayArea />
  );
}