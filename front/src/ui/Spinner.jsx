function Spinner() {
  return (
    <div
      className="mx-auto my-[4.8rem] aspect-square w-[6.4rem] animate-[spin_1.5s_linear_infinite] rounded-full"
      style={{
        background: `radial-gradient(farthest-side, var(--blue-main) 94%, #0000) top/10px 10px no-repeat, conic-gradient(#0000 30%, var(--blue-main))`,
        WebkitMask: `radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0)`,
        mask: `radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0)`,
      }}
    ></div>
  );
}

export default Spinner;
