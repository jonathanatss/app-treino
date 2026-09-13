import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  window.eval(readFileSync(join(process.cwd(), "public/src/image-processor.js"), "utf8"));
});

describe("image processor", () => {
  it("reduz paisagem para no máximo 1440px preservando proporção", () => {
    expect(window.FitPlanImageProcessor.dimensionsWithin(4032, 3024, 1440)).toEqual({ width: 1440, height: 1080 });
  });

  it("reduz retrato para no máximo 1440px preservando proporção", () => {
    expect(window.FitPlanImageProcessor.dimensionsWithin(3000, 4000, 1440)).toEqual({ width: 1080, height: 1440 });
  });

  it("não amplia imagens menores", () => {
    expect(window.FitPlanImageProcessor.dimensionsWithin(800, 600, 1440)).toEqual({ width: 800, height: 600 });
  });
});
