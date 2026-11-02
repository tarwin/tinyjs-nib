// Prints the window number of the on-screen window titled exactly
// argv[1] (for `screencapture -l`). Used by scripts/screenshots.sh.
import CoreGraphics
let want = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Nib"
let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] ?? []
for w in list where (w[kCGWindowLayer as String] as? Int) == 0 {
  if let name = w[kCGWindowName as String] as? String, (name == want || name.hasPrefix(want + " — ")), let id = w[kCGWindowNumber as String] as? Int {
    print(id)
    break
  }
}
