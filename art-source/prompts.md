# ImageGen prompts

## nursery-balloon.png

Mode: built-in generation, transparent background. Style reference: user attachment `_.jpeg`; no poster text or event data reused.

Use case: illustration-story. Asset type: individual transparent watercolor accent for a Ukrainian safari baby invitation. Input image: STYLE REFERENCE ONLY, not an edit target. Create an original single vintage hot-air balloon in pale sage green and warm cream vertical stripes, a small woven wicker basket, delicate fine ropes, accompanied by two small soft ivory-grey watercolor clouds near its shoulders. Traditional nursery watercolor, granulated pigment, soft drybrush edges and translucent washes, gentle muted palette matching the reference. Portrait 2:3 framing, complete balloon including basket inside frame with a modest transparent margin. Balloon remains the main subject, clouds secondary and airy. Genuinely transparent background, no paper rectangle, no scenery or ground, no text, dates, logos, watermark, animals, people or extra accessories. Do not reproduce the reference poster or its composition.

## baby-clothesline.png

Mode: built-in generation, transparent background. Style reference: user attachment `_.jpeg`; original illustration rather than an extracted clipart.

Use case: illustration-story. Asset type: individual transparent horizontal watercolor accent for a Ukrainian safari baby invitation RSVP section. Input image: STYLE REFERENCE ONLY, not an edit target. Create an original gentle nursery clothesline illustration: one short gently curved natural linen cord, four little wooden pegs holding two baby rompers side by side, one pale olive sage linen romper with a tiny cream shirt, the other soft dusty blush peach romper. Small airy eucalyptus sprig tied at one end only. Traditional delicate nursery watercolor, visible soft pigment grain and drybrush edges, muted vintage sage, warm ivory and dusty pale rose matching the reference. Horizontal landscape 3:2 composition, complete cord and clothes entirely inside frame with transparent margin, clothing hangs at the same level. Genuinely transparent background. No lettering, dates, poster, people, animals, room, scenery, backdrop, shadow or paper rectangle. Do not reproduce reference poster composition.

Mode: built-in `image_gen.imagegen`, `transparent_background: true`. Initial safari assets were generated without image references. The nursery additions below use the subsequently supplied reference only for style. Each asset was generated separately. These are the final prompts, with the common specification prepended to the initial individual subjects.

## Common specification

Use case: illustration-story. Asset for a boutique Ukrainian safari baby invitation, individually isolated on genuinely transparent background. Traditional watercolor painted on cold pressed paper, visible watery pigment blooms, granulation, delicate drybrush edge, imperfect hand-painted natural forms. Warm vintage children's book illustration, sophisticated restrained watercolor, soft natural anatomy, tiny dark eyes, absolutely no glossy 3D, no vector cartoon outlines, no emoji, no text, no shadows, no ground plane, no background. Muted olive/sage forest greens, honey ochre, natural warm grey and cocoa. Entire subject inside frame with generous transparent margin. Cohesive high-end nursery watercolor collection.

## giraffe.png

Primary subject: A gentle young giraffe standing, full body, long graceful neck, soft warm ochre irregular spots, small ears and horns, face turned slightly toward viewer. Subtle charming innocent expression, natural proportions with a slightly larger nursery head.

## elephant.png

Primary subject: A gentle baby elephant seated, full body, large soft ears, grey beige watercolor skin with rosy clay inner ears, trunk raised gently to the left. Sweet small eyes, tactile watercolor detail.

## monkey.png

Primary subject: A sweet small baby monkey hanging by one hand from a thin curving leafy vine, full body, tail curling below, other hand resting at belly, warm cocoa brown fur, pale beige face and ears. Delicate natural believable anatomy.

## foliage.png

Primary subject: One lush botanical spray of tropical jungle leaves: a large painted monstera leaf with split edges, two wide banana leaves, several delicate fern and palm fronds. Fan composition growing out from bottom-left root toward upper-right, airy natural watercolor with overlapping transparent sage, forest olive and yellow green pigments. No pot. Botanical specimen painted with organic imperfect shapes.

## elephant-blue.png

Mode: built-in imagegen edit, transparent background. Edit target: `public/art/elephant.webp`.

Use case: precise-object-edit. Asset type: transparent watercolor animal cutout for a Ukrainian safari baby invitation prediction card. Edit target: the provided seated baby elephant. Primary request: add one clearly visible soft dusty pastel BLUE ribbon bow tied around the elephant's neck, just under its chin. Preserve exactly the existing elephant's pose, raised trunk, full body, head shape, size, placement, warm grey-beige watercolor skin, clay pink inner ears, tiny sweet eyes, natural anatomy, pigment granulation and hand-painted texture. Keep identical full-body framing and aspect ratio. Bow should look traditionally watercolor painted in the same nursery illustration style, soft blue loops and two short ribbon tails, reasonably large enough to read when the illustration is displayed at 170px high. Change only the addition of the bow; no hat, clothes, new animal, accessories, text or surroundings. Full subject with transparent margin, genuinely transparent background, preserve alpha. No floor, no shadow, no backdrop, no shiny 3D, no vector outline. Do not crop trunk, ears, feet or tail.

## elephant-pink.png

Mode: built-in imagegen edit, transparent background. Edit target: generated `elephant-blue.png`.

Use case: precise-object-edit. Edit target: the provided transparent watercolor baby elephant with blue neck bow. Change ONLY the ribbon bow color from dusty blue to soft dusty ROSE PINK, including its loops, knot and tails. Keep every other detail visually identical: same seated elephant, exact pose, raised trunk, facial features, ears, eyes, feet, body, watercolor texture, crop, transparent margins, image size, orientation, placement, proportions and bow shape and size. The two images will appear side-by-side in matching boy/girl prediction cards and must align perfectly. Genuinely transparent background and preserve alpha. No added accessories, no text, no shadow, no background. Do not crop the subject.

## monkey-character.png

Mode: built-in imagegen edit, transparent background. Edit target: `public/art/monkey.webp`.

Use case: precise-object-edit. Asset type: isolated animation layer for an existing watercolor safari invitation. Edit target: provided monkey holding a leafy vine. Remove ONLY the entire green branch, vine, leaves and tendrils. Preserve the complete brown baby monkey EXACTLY in its existing location, pose, scale, texture, expression and 2:3 portrait canvas framing. Keep its raised hand as a closed gripping fist in the exact same position; reconstruct the small part of its fingers that the branch obscured. Keep the entire raised arm, ears, face, body, feet and curled tail. Do not re-center the monkey: preserve the transparent space above and around it and its registration to the original frame, so this layer can be overlaid over the original image. All areas occupied by branch or foliage become genuinely transparent. This is the character-only layer; no vegetation at all, no new props, no background, no shadows, no text. Preserve traditional warm cocoa watercolor, paper pigment texture, soft natural edges and the original anatomy. Full canvas 2:3 portrait, entire monkey inside frame.

## monkey-branch.png

Mode: built-in imagegen edit, transparent background. Edit target: `public/art/monkey.webp`.

Use case: precise-object-edit. Asset type: stationary branch-only animation layer for an existing watercolor safari invitation. From the provided image remove the ENTIRE brown monkey, every bit of its hand, fur, body and tail. Keep ONLY the existing thin curving green leafy branch and its tendrils at the top. Reconstruct the small part of the branch hidden behind the hand, so the branch is continuous. Keep branch shape, leaf shapes, olive watercolor pigment, tilt, thickness, size and position EXACTLY as in the reference. Preserve the original full 2:3 portrait canvas and transparent empty lower two thirds of the image. Do not center or enlarge the branch: its location must register with the original reference when overlaid. Genuinely transparent background including all the empty lower area; no backdrop, glow, haze, shadow, text, monkeys, hands or extra decorations. Traditional botanical watercolor texture, natural delicate edges.
