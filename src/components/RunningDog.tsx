import { useLanguage } from '../i18n/LanguageContext';

/**
 * A cute 2D puppy (two animated GIFs: walking, barking) that strolls back and forth along the top edge of the "All Topics"
 * card, above the "Bé thích chơi nhất!" badge, and stops a few times to bark "Gâu gâu!". Pure decoration: the whole
 * 62 s route (travel, stops, turn-arounds, which GIF and the speech bubble are visible) is timed in index.css (.dog-*),
 * it ignores clicks and is hidden from screen readers.
 */
export function RunningDog() {
  const { t } = useLanguage();
  return (
    <div className="dog-run" aria-hidden="true">
      <div className="dog-face">
        <div className="dog-flip">
          <img className="dog-gif dog-walk" src="/assets/dog-walk.gif" alt="" width={44} height={32} draggable={false} />
          <img className="dog-gif dog-bark" src="/assets/dog-bark.gif" alt="" width={44} height={32} draggable={false} />
        </div>
        <span className="dog-bubble">{t('dogBark')}</span>
      </div>
    </div>
  );
}
