import { join } from "path";
import { mkdirSync, renameSync } from "fs";
import Map from "./ext-file-entries";

const outDir = "dist";
mkdirSync(outDir, { recursive: true });

(async () => {
  for (const [src, outfile] of Object.entries(Map)) {
    const result = await Bun.build({
      entrypoints: [src],
      outdir: outDir,
      minify: true,
    });

    if (!result.success) {
      console.error(` Failed to build ${src}`, result.logs);
      continue;
    }

    const builtFile = result.outputs[0]?.path;
    const target = join(outDir, outfile);

    renameSync(builtFile!, target);
    console.log(`Built: ${src} → ${target}`);
  }

  console.log("All builds done!");
})();
