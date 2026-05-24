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
  assert.match(layout, /width:\s*100%/);
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
