import { FC } from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";

interface Props extends HTMLMotionProps<"div"> {
  text: string;
  delay?: number;
  replay?: boolean;
  duration?: number;
}

export const WavyText: FC<Props> = ({
  text,
  delay = 0,
  duration = 0.005,
  replay = true,
  ...props
}: Props) => {
  const letters = Array.from(text);

  const container: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: duration, delayChildren: i * delay },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.span
      style={{ display: "flex" }}
      variants={container}
      initial="hidden"
      animate={replay ? "visible" : "hidden"}
      {...props}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} className="animated-letter">
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};
