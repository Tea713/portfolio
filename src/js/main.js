gsap.registerPlugin(SplitText);

let splitName = SplitText.create(".name", {
  type: "chars",
  charsClass: "chars",
});

gsap.from(splitName.chars, {
  autoAlpha: 0,
  stagger: {
    amount: 1.5,
    from: "random",
  },
});

let splitAbout = SplitText.create(".about", {
  type: "words, lines",
  lineClass: "line",
  autoSplit: true,
  mask: "lines",
  onSplit: (self) => {
    split = gsap.from(self.lines, {
      duration: 0.6,
      yPercent: 100,
      opacity: 0,
      stagger: 0.1,
      ease: "expo.out",
    });
    return split;
  },
});

splitAbout.timeScale(0.2).play(0);
