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

  function arraysAreEqual(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) {
      return false; // Different lengths, can't be equal
    }
    return arr1.every((val) => arr2.includes(val));
  }

  const arrOfWords: Array<Array<string>> = [[]];

  letters.forEach((item) => {
    if (item !== " ") {
      const lastArrIsSpace = arraysAreEqual(arrOfWords[arrOfWords.length - 1], [
        " ",
      ]);

      if (lastArrIsSpace) {
        arrOfWords.push([item]);
      } else {
        arrOfWords[arrOfWords.length - 1].push(item);
      }
    } else {
      arrOfWords.push([" "]);
    }
  });

  return (
    <motion.span
      className="dialog-text"
      style={{ wordWrap: "break-word" }}
      variants={container}
      initial="hidden"
      animate={replay ? "visible" : "hidden"}
      {...props}
    >
      {arrOfWords.map((wordArr, index) => (
        <p key={index}>
          {wordArr.map((letter, index) => (
            <motion.span
              key={index}
              variants={child}
              className="animated-letter"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </p>
      ))}
    </motion.span>
  );
};
