const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = Array.from(
    css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "g")),
  );

  assert.ok(matches.length, `Expected CSS rule for ${selector}`);
  return matches.map(function (match) {
    return match[1];
  }).join("\n");
}

test("the chat image establishes the responsive coordinate system", function () {
  const composite = rule(".chat-composite");
  const layout = rule(".chat-layout");

  assert.match(composite, /width:\s*min\(840px,\s*100%\)/);
  assert.match(composite, /display:\s*block/);
  assert.match(layout, /width:\s*100%/);
});

test("desktop images are centered and height-limited without shrinking mobile images", function () {
  const frameAndComposite = rule(".stimulus-frame,\n.chat-composite");
  const images = rule(".stimulus-frame img,\n.chat-layout");
  const desktopMedia = css.match(
    /@media\s*\(min-width:\s*761px\)\s*\{([\s\S]*?)\n\}/,
  );

  assert.match(frameAndComposite, /margin:\s*8px auto 28px/);
  assert.match(images, /width:\s*100%/);
  assert.ok(desktopMedia, "Expected a desktop-only media query");
  assert.match(
    desktopMedia[1],
    /max-width:\s*min\(840px,\s*calc\(\(100vh - 300px\) \* 0\.6106\)\)/,
  );
  assert.doesNotMatch(
    css.match(/@media\s*\(max-width:\s*760px\)\s*\{([\s\S]*?)\n\}/)[1],
    /calc\(\(100vh - 300px\)/,
  );
});

test("both avatars scale and remain positioned relative to the chat image", function () {
  const avatars = rule(".chat-avatar1,\n.chat-avatar2");
  const firstAvatar = rule(".chat-avatar1");
  const secondAvatar = rule(".chat-avatar2");

  assert.match(avatars, /height:\s*auto/);
  assert.match(avatars, /left:\s*4\.1667%/);
  assert.match(avatars, /width:\s*10\.7143%/);
  assert.match(firstAvatar, /top:\s*1\.8173%/);
  assert.match(secondAvatar, /top:\s*49\.0658%/);
  assert.doesNotMatch(css, /\.chat-avatar\s*\{/);
});
