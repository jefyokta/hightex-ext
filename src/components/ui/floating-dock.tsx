import { cn } from "@/lib/utils";
import { useNavigate } from "@/route";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; path: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};



const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; path: string }[];
  className?: string;
}) => {

  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto  h-full  gap-4 rounded-2xl justify-center items-center bg-gray-50 px-4 py-2 flex dark:bg-neutral-900",
        className,
      )}
    >
      {items.map((item, i) => (
        //@ts-ignore
        <IconContainer mouseX={mouseX} key={item.title} {...item} icon={item.icon} key={i} />
      ))}
    </motion.div>
  );
};


function IconContainer({
  mouseX,
  title,
  icon,
  path,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  path: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // 🔽 Skala lebih kecil (mirip toolbar Chrome Extension)
  let widthTransform = useTransform(distance, [-150, 0, 150], [28, 40, 28]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [28, 40, 28]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [14, 20, 14]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [14, 20, 14]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const to = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <a onClick={() => to({ path })}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
