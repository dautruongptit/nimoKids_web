/**
 * A cute 2D puppy (animated GIF, running on the spot) that travels back and forth along the top edge of the "All Topics"
 * card, above the "Bé thích chơi nhất!" badge. Pure decoration: the travel and the turn-around live in index.css (.dog-*),
 * it ignores clicks and is hidden from screen readers.
 */
export function RunningDog() {
  return (
    <div className="dog-run" aria-hidden="true">
      <div className="dog-face">
        <img className="dog-gif" src="/assets/dog-run.gif" alt="" width={44} height={32} draggable={false} />
      </div>
    </div>
  );
}
