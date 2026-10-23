import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { eventConfig } from '../src/eventConfig';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

test('opening, skip, replay and keyboard navigation', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'До змісту запрошення' })).toBeFocused();
  await page.getByRole('button', { name: 'Відкрити запрошення', exact: false }).click();
  await expect(page.locator('.hero-answer')).toHaveAttribute('aria-hidden', 'false');
  const skip = page.getByRole('button', { name: 'Пропустити анімацію' });
  if (await skip.isVisible()) await skip.click();
  await expect(page.locator('.hero-answer')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Відтворити ще раз' }).click();
  await expect(page.locator('.hero-answer')).toHaveAttribute('aria-hidden', 'true');
  await page.getByRole('button', { name: 'Відкрити без анімації' }).click();
  await expect(page.locator('.hero-answer')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'Наша маленька історія' }).click();
  await expect(page).toHaveURL(/#story$/);
});

test('prediction persists and can change, with no fake counters', async ({ page }) => {
  await page.getByRole('button', { name: /Хлопчик Маленький дослідник/ }).click();
  await expect(page.getByText('Ваш прогноз збережено!')).toBeVisible();
  await page.reload();
  const boy = page.locator('[data-choice="boy"]');
  await expect(boy).toHaveAttribute('aria-pressed', 'true');
  const girl = page.locator('[data-choice="girl"]');
  await girl.click();
  await expect(girl).toHaveAttribute('aria-pressed', 'true');
  await expect(boy).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.prediction-response')).not.toContainText('%');
});

test('RSVP validates, saves, reloads and edits both attendance answers', async ({ page }) => {
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.locator('#guest-name')).toBeFocused();
  await expect(page.locator('#name-error')).toBeVisible();
  await page.getByLabel('Ваше ім’я').fill('Марія');
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.locator('#attendance-error')).toBeVisible();
  await page.getByLabel('Так, із радістю!').check();
  await page.getByLabel('Кілька теплих слів').fill('Чекаємо на маленьке диво!');
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.getByRole('heading', { name: 'Дякуємо, Марія!' })).toBeVisible();
  await expect(page.locator('.rsvp-confirmation .local-note')).toContainText(
    'не надіслана організаторам',
  );
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Дякуємо, Марія!' })).toBeVisible();
  await page.getByRole('button', { name: 'Змінити відповідь' }).click();
  await expect(page.getByLabel('Ваше ім’я')).toHaveValue('Марія');
  await expect(page.getByLabel('Кілька теплих слів')).toHaveValue('Чекаємо на маленьке диво!');
  await page.getByLabel('На жаль, не зможу').check();
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.getByText('Нам вас бракуватиме.')).toBeVisible();
});

test('leaf surprise works by click or touch and does not widen the page', async ({
  page,
}, testInfo) => {
  const leaf = page.getByRole('button', { name: 'Відкрити листочок' });
  if (testInfo.project.name === 'mobile') await leaf.tap();
  else await leaf.click();
  await expect(page.locator('#surprise-secret')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#surprise-secret')).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Сховати секрет' }).click();
  await expect(page.locator('#surprise-secret')).toHaveAttribute('aria-hidden', 'true');
});

test('calendar download has correct UTC time, CRLF and UTF-8 folding', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Додати в календар' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('malenke-dyvo.ics');
  const path = await download.path();
  const text = await readFile(path!, 'utf8');
  expect(text).toContain('DTSTART:20270522T120000Z\r\n');
  expect(text).toContain('DTEND:20270522T150000Z\r\n');
  expect(text.replace(/\r\n /g, '')).toContain(eventConfig.title);
  expect(text).toContain('BEGIN:VCALENDAR\r\n');
  expect(text).toContain('END:VCALENDAR\r\n');
  for (const line of text.split('\r\n')) expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75);
  await expect(page.getByRole('link', { name: 'Як дістатися' })).toHaveCount(0);
});

test('blocked storage is reported honestly and does not crash', async ({ page }) => {
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Denied', 'SecurityError');
    };
  });
  await page.locator('[data-choice="boy"]').click();
  await expect(page.getByText('Браузер не дозволяє зберегти його після закриття.')).toBeVisible();
  await page.getByLabel('Ваше ім’я').fill('Олексій');
  await page.getByLabel('Так, із радістю!').check();
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.locator('.rsvp-confirmation .local-note')).toContainText(
    'Браузер не дозволяє зберегти відповідь',
  );
});

test('countdown reaches zero without negative values', async ({ page }) => {
  await page.clock.install({ time: new Date('2027-05-22T11:59:50Z') });
  await page.clock.pauseAt(new Date('2027-05-22T11:59:58Z'));
  await page.reload();
  await expect(page.locator('.countdown-number').last()).toHaveText('02');
  await page.clock.fastForward(4000);
  await expect(page.locator('.countdown-number')).toHaveText(['00', '00', '00', '00']);
  await expect(page.getByText('Наш особливий день настав!')).toBeVisible();
});

test('accessibility baseline and form error state', async ({ page }) => {
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('live reduced motion completes opening and leaves every feature usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Відкрити запрошення' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-answer')).toHaveCSS('opacity', '1');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await page.getByRole('button', { name: 'Зазирнути під листочок' }).click();
  await expect(page.locator('#surprise-secret')).toHaveCSS('opacity', '1');
});

test('short landscape viewport remains scrollable and navigation works', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.getByRole('link', { name: 'Ми будемо' }).click();
  await expect(page).toHaveURL(/#rsvp$/);
  await expect(page.getByLabel('Ваше ім’я')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('no errors, missing local assets or external requests', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:5319') && !request.url().startsWith('data:'))
      external.push(request.url());
  });
  await page.reload();
  for (const section of [
    '#story',
    '#prediction',
    '#details',
    '#schedule',
    '.surprise',
    '#rsvp',
    '.closing',
  ])
    await page.locator(section).scrollIntoViewIfNeeded();
  const broken = await page.evaluate(() =>
    [...document.images]
      .filter((image) => image.complete && !image.naturalWidth)
      .map((image) => image.src),
  );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`responsive book ${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'All five widths are checked once.');
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await page.screenshot({ path: `output/qa/hero-${width}.png`, animations: 'disabled' });
    for (const section of [
      '#story',
      '#prediction',
      '#details',
      '#schedule',
      '.surprise',
      '#rsvp',
      '.closing',
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        section,
      ).toBe(true);
      const overlaps = await page
        .locator(`${section} h2`)
        .evaluateAll((headings) =>
          headings.filter((h) => h.scrollWidth > h.clientWidth + 2).map((h) => h.textContent),
        );
      expect(overlaps).toEqual([]);
      await page
        .locator(section)
        .screenshot({ path: `output/qa/${section.replace(/[.#]/, '')}-${width}.png` });
    }
    await page.screenshot({ path: `output/qa/full-${width}.png`, fullPage: true });
  });
}
