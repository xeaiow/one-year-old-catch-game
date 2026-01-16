import * as React from 'react';
import {
  LayoutGroup,
  motion,
  useAnimate,
  delay,
  type Transition,
  type AnimationSequence,
  type AnimationPlaybackControls,
} from 'motion/react';

interface ComponentProps {
  orbitItems: OrbitItem[];
  stageSize?: number;
  imageSize?: number;
}

type OrbitItem = {
  id: number;
  name: string;
  src: string;
};

const transition: Transition = {
  delay: 0,
  stiffness: 300,
  damping: 35,
  type: 'spring',
  restSpeed: 0.01,
  restDelta: 0.01,
};

const spinConfig = {
  duration: 30,
  ease: 'linear' as const,
  repeat: Infinity,
};

const qsa = (root: Element, sel: string) =>
  Array.from(root.querySelectorAll(sel));

const angleOf = (el: Element) => Number((el as HTMLElement).dataset.angle || 0);

const armOfImg = (img: Element) =>
  (img as HTMLElement).closest('[data-arm]') as HTMLElement | null;

export const Component = ({
  orbitItems,
  stageSize = 320,
  imageSize = 60,
}: ComponentProps) => {
  const step = 360 / orbitItems.length;
  const [scope, animate] = useAnimate();
  const [hoveredItem, setHoveredItem] = React.useState<OrbitItem | null>(null);
  const animationControls = React.useRef<AnimationPlaybackControls[]>([]);

  const handleMouseEnter = () => {
    animationControls.current.forEach((ctrl) => ctrl.pause());
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    animationControls.current.forEach((ctrl) => ctrl.play());
  };

  React.useEffect(() => {
    const root = scope.current;
    if (!root) return;

    // get arm and image elements
    const arms = qsa(root, '[data-arm]');
    const imgs = qsa(root, '[data-arm-image]');

    // image lift-in
    delay(() => animate(imgs, { top: 0 }, transition), 250);

    // build sequence for orbit placement
    const orbitPlacementSequence: AnimationSequence = [
      ...arms.map((el): [Element, Record<string, any>, any] => [
        el,
        { rotate: angleOf(el) },
        { ...transition, at: 0 },
      ]),
      ...imgs.map((img): [Element, Record<string, any>, any] => [
        img,
        { rotate: -angleOf(armOfImg(img)!) },
        { ...transition, at: 0 },
      ]),
    ];

    // play placement sequence
    delay(() => animate(orbitPlacementSequence), 700);

    // start continuous spin for arms and images
    delay(() => {
      const controls: AnimationPlaybackControls[] = [];

      // arms spin clockwise
      arms.forEach((el) => {
        const angle = angleOf(el);
        const ctrl = animate(el, { rotate: [angle, angle + 360] }, spinConfig);
        controls.push(ctrl);
      });

      // images counter-spin to stay upright
      imgs.forEach((img) => {
        const arm = armOfImg(img);
        const angle = arm ? angleOf(arm) : 0;
        const ctrl = animate(
          img,
          { rotate: [-angle, -angle - 360] },
          spinConfig,
        );
        controls.push(ctrl);
      });

      animationControls.current = controls;
    }, 1300);

    return () => {
      animationControls.current.forEach((ctrl) => ctrl.cancel());
    };
  }, []);

  return (
    <LayoutGroup>
      <motion.div
        ref={scope}
        className="relative overflow-visible"
        style={{ width: stageSize, height: stageSize }}
        initial={false}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Center label */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: hoveredItem ? 1 : 0,
              scale: hoveredItem ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-light text-neutral-700 tracking-wide"
          >
            {hoveredItem?.name}
          </motion.span>
        </div>

        {orbitItems.map((item, i) => (
          <motion.div
            key={item.id}
            data-arm
            className="will-change-transform absolute inset-0 pointer-events-none"
            data-angle={i * step}
            layoutId={`arm-${item.id}`}
          >
            <motion.img
              data-arm-image
              className="rounded-full object-fill absolute left-1/2 top-1/2 aspect-square translate -translate-x-1/2 cursor-pointer transition-transform hover:scale-110 pointer-events-auto"
              style={{
                width: imageSize,
                height: imageSize,
              }}
              src={item.src}
              alt={item.name}
              draggable={false}
              layoutId={`arm-img-${item.id}`}
              onMouseEnter={() => setHoveredItem(item)}
            />
          </motion.div>
        ))}
      </motion.div>
    </LayoutGroup>
  );
};
