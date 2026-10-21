// Renderiza o vídeo quadro a quadro e entrega ao ffmpeg, com música
import { start, openPage } from './lib.mjs';
import { spawn } from 'node:child_process';
const [fmt, fin, out, music = '', dur = '38'] = process.argv.slice(2);
const [w, h] = { '45': [1080, 1350], '916': [1080, 1920], '169': [1920, 1080] }[fmt];
const FPS = 30, N = Math.round(+dur * FPS);
const env = await start();
const page = await openPage(env, w, h);
await page.evaluate(async (fmt, fin) => { await V.setup({ fmt, fin }); }, fmt, fin);
const args = ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
if (music) args.push('-i', music, '-af', `atrim=0:${dur},asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st=${+dur - 3}:d=3,loudnorm=I=-14:TP=-1.5:LRA=11`, '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-shortest');
args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', out);
const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  await page.evaluate(t => V.frame(t), i / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 150 === 0) console.log(fmt, i, '/', N, Math.round((Date.now() - t0) / 1000) + 's');
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await env.close();
console.log('ok', out, Math.round((Date.now() - t0) / 1000) + 's');
