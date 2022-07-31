const R = function () {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) d(r);
  new MutationObserver((r) => {
    for (const a of r)
      if (a.type === "childList")
        for (const g of a.addedNodes)
          g.tagName === "LINK" && g.rel === "modulepreload" && d(g);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(r) {
    const a = {};
    return (
      r.integrity && (a.integrity = r.integrity),
      r.referrerpolicy && (a.referrerPolicy = r.referrerpolicy),
      r.crossorigin === "use-credentials"
        ? (a.credentials = "include")
        : r.crossorigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function d(r) {
    if (r.ep) return;
    r.ep = !0;
    const a = o(r);
    fetch(r.href, a);
  }
};
R();
const C = { easing: "ease", duration: 500, fill: "forwards" },
  T = ({ frames: t, targetElement: n, timingOptions: o = {} }) =>
    n.animate(t, { ...C, ...o }),
  L = (t) => t.getBoundingClientRect().height,
  v = ({ oldStep: t, newStep: n, element: o, name: d }) => {
    const r = new CustomEvent(d, {
      detail: { oldStep: t, newStep: n, element: o },
    });
    o.dispatchEvent(r);
  },
  B = (t) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        t();
      });
    });
  },
  V = (t) => t === "backward",
  N = (t) => [...t].reverse(),
  S = {
    stepIsValid: async (t) => !0,
    frames: [
      { transform: "translateX(-100%)" },
      { transform: "translateX(0)" },
    ],
  };
function w(t, n = S) {
  n = { ...S, ...n };
  const o = t.querySelector("[data-steppp-wrapper]") || t,
    d = n.stepSelector ? o.querySelectorAll(n.stepSelector) : o.children,
    r = Array.from(d),
    a = { ...S, ...n },
    { stepIsValid: g } = a,
    u = (e = k()) => r[e],
    X = (e = "") => r.find((s) => s.dataset.stepppName === e),
    k = () => r.findIndex((e) => e.dataset.stepppActive !== void 0) || 0,
    x = (e) => A({ stepName: e }),
    I = () => A(),
    O = () => A({ direction: "backward" }),
    y = (e) => ((e.timingOptions = n.timingOptions), T(e)),
    F = (e, s, i) => {
      const p = V(i),
        { enter: h, exit: l } = P,
        m = `${E}px`,
        c = `${q(s)}px`;
      return [
        y({ frames: p ? N(l) : l, targetElement: p ? s : e }),
        y({ frames: p ? N(h) : h, targetElement: p ? e : s }),
        y({ frames: [{ height: m }, { height: c }], targetElement: o }),
      ];
    },
    A = async ({ stepName: e = "", direction: s = "forward" } = {}) => (
      f.length && f.map((i) => i.finish()),
      new Promise((i) => {
        B(async () => {
          const p = s === "forward" ? 1 : -1,
            h = u(),
            l = X(e) || u(k() + p),
            m = { oldStep: h, newStep: l, element: t };
          if (s === "forward" && !(await g(u())))
            return v({ ...m, name: "steppp:invalid" }), i();
          if (!l) return v({ ...m, name: "steppp:abort" }), i();
          v({ ...m, name: "steppp:start" }),
            B(
              async () => (
                (f = F(h, l, s)),
                await Promise.all(f.map((c) => c.finished)),
                f.forEach((c) => {
                  c.commitStyles(), c.persist();
                }),
                (f = []),
                r.forEach((c) => {
                  delete c.dataset.stepppActive,
                    b.unobserve(c),
                    (c.style.display = "none");
                }),
                (l.style.display = "block"),
                (l.dataset.stepppActive = ""),
                b.observe(l),
                v({ ...m, name: "steppp:complete" }),
                i()
              )
            );
        });
      })
    ),
    q = (e, s) => {
      (t.style.height = ""), (e.style.display = "block");
      const i = s || L(e);
      return (E = i), i;
    },
    $ = (e) =>
      Array.isArray(e) ? { enter: e, exit: [...e.slice()].reverse() } : e,
    b = new ResizeObserver((e) => {
      const s = e[0];
      if (!s) return;
      const i = E,
        { height: p } = s.contentRect;
      q(s.target, p),
        y({
          frames: [{ height: `${i}px` }, { height: `${p}px` }],
          targetElement: o,
        });
    }),
    P = $(n.frames);
  let f = [];
  u().style.position = "absolute";
  const H = L(u());
  o.style.height = `${H}px`;
  let E = H;
  return (
    b.observe(u()),
    t.querySelectorAll("[data-steppp-backward]").forEach((e) => {
      e.addEventListener("click", O);
    }),
    t.querySelectorAll("[data-steppp-forward]").forEach((e) => {
      e.addEventListener("click", I);
    }),
    t.querySelectorAll("[data-steppp-to]").forEach((e) => {
      e.addEventListener("click", () => {
        console.log(e.dataset.stepppTo), x(e.dataset.stepppTo || "");
      });
    }),
    { backward: O, forward: I, moveTo: x }
  );
}
w.stepIsValid = (t) => !0;
w(document.getElementById("steppp1"), {
  frames: [{ opacity: "0" }, { opacity: "1" }],
});
w(document.getElementById("steppp2"), {
  frames: {
    enter: [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
    exit: [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
  },
});
w(document.getElementById("steppp3"), {
  frames: {
    enter: [
      { transform: "rotate(0deg)", opacity: 0 },
      { transform: "rotate(360deg)", opacity: 1 },
    ],
    exit: [
      { transform: "rotate(360deg)", opacity: 1 },
      { transform: "rotate(0deg)", opacity: 0 },
    ],
  },
});
