---
title: tba
date: 0000-00-00
tags:
    - java
    - kindle
    - embedded devices
    - hacking
    - development
last_updated: 0000-00-00
featured_image: /assets/images/33240633.png
---
# Introduction

After buying a second hand Kindle Paperwhite, the "engineer" part of my brain jumped to action.

The MobileRead Kindle hacking subculture is a niche and very tightly knit community of excellent developers and maintainers. It's fascinating reading the forums - even threads from over a decade ago and noticing some of the same recurring names popping up. The deep knowledge these devs possess has taught me one thing about the underlying Kindle firmware: Amazon had no fucking clue what they were doing.

To learn Java for uni I thought this would be useful alongside studies and admittedly after the breakdowns and resentment towards both the language as well as Amazon engineers. I won't ever look at Java the same again.

---
# Jailbreaking device

This marked the beginning of the journey that was unseemingly headed for a world of disaster and significant IQ loss.

[LanguageBreak](https://github.com/notmarek/LanguageBreak) was the most recent jailbreak at the time and worked very well. A slightly longer and involved setup but enjoyed the fact that it didn't require the device being registered.

<p align="center">
    <img src="/assets/images/kindleGameOfLifePost/2.jpg" height="1000" width="500">
</p>

Since then I used [WinterBreak](https://github.com/KindleModding/WinterBreak) which has been so far the easiest to configure on a freshly installed firmware.

---
# Understanding the internals

> *My guess is that either 1) they wanted the whole thing to be HTML and halfway through realized it wouldn't work and fell back to Java, but didn't have time to rewrite everything or 2) they wanted the whole thing is Java but didn't have time to rewrite everything and then quickly whipped up some HTML stuff they were doing for the browser anyways.*

*"Amazon had no fucking clue what they were doing."* Or were they? Getting anything done on the proprietary, locked-down OS is trichotillomania-inducing:
- The restricted [capabilities](https://wiki.mobileread.com/wiki/Kindlet_Developer_HowTo#What_are_the_restrictions_with_the_Kindle.27s_cvm.3F:~:text=There%20are%20certainly%20more...) of the Kindle's CVM
- the obfuscation of crucial classes
- [MEMORY LEAKS](https://cowlark.com/kindle/getting-started.html#:~:text=the%20memory%20used%20for%20those%20members%20will%20never%20be%20freed.%20Ever.)
- e-ink behaviour.
- etc.
<br>

They explicitly made it very hard to homebrew anything. After writing the Java [applet](https://en.wikipedia.org/wiki/Java_applet) that would serve as the basis of this project, finding out afterwards that the interface making it possible to run it—a *Kindlet*—was completely deprecated and useless for devices past 5.1 firmware, was slightly crushing. But when there's a will, there's a way.

The **Booklet** class luckily contains similar behaviour, however due to the moral of this story... the source code for the methods were obfuscated :/

It was a miracle looking through past projects that somehow made sense of the Booklet API, mainly [this](https://github.com/coplate/KUAL_Booklet/blob/master/src/com/mobileread/ixtab/kindlelauncher/KualBooklet.java) and [this](https://github.com/ieb/Signalk_Booklet/tree/master/src/main/java/uk/co/tfd/kindle/signalk). On a Kindlet, you would have to sign the Java jar using a keystore that comes with the jailbreak for the application to run, with the Booklet implementation this is replaced with the application being registered at a system-level SQL database. Additionally that leaves the UI side, which looking at the projects didn't differ much from a regular JSwing application, however the e-ink screen left me suspicious.

Looking from the root directory using [USBNetwork](https://wiki.mobileread.com/wiki/USBNetwork), I noticed by grepping the system for important libraries, it turns out ```kafui.jar``` contains Swing.

Using ancient libraries; **Java 1.8**; **Personal Compact 1**; was not an optimal tech stack, but there was hope.

<p align="center">
    <img src="/assets/images/kindleGameOfLifePost/1.jpg" height="1000" width="500">
</p>

---
# Game development

The choice of choosing Conway's Game Of Life was relatively ambitious but sufficiently practical compared to the cliched Hello World application a developer would start off with.

The Wikipedia page for the cellular automaton by mathematician John Horton Conway was the goto reference throughout develpoment and I took the standard approach for the logic - **B3/S23**.

**Bonus**: This [website](https://conwaylife.com/wiki/) was quite helpful too and is a super interesting rabbit hole in and of itself.


---
# Porting to Kindle

Getting to work, just taking the logic from the applet I wrote, I tested to see how the game grid would function. To my suprise it worked well, not that I didn't except it to work as I have practically took a lot of the working code from the shown-to-work Booklet projects I mentioned, but for such old hardware it was nice to see the thing you built just slapped on there.

## Unforeseen issues

Of course not all was well, the e-ink display became my worst enemy almost immediately. With each game update, the screen gave a very unappealing flicker making the Game of Life looked very much like a seizure warning come to life, complete with jarring deformed visual artifacts on the screen, rather than the elegant cellular automaton it's supposed to be.

The Kindle's refresh rate was never designed for anything approaching real-time updates, so naturally this was the biggest roadblock. I'd like to say I had a graceful solution to this problem, but the Kindle was built to swipe a page every minute or so, so I had to make some hacky workarounds.

```java
if (Util.isKindle()) {
    scheduleRefresh(300);
    scheduleRefresh(600);
    scheduleRefresh(1200);
    scheduleRefresh(2000);
    scheduleRefresh(3000);
    ...
}
```
<br>

Anyways... the ghosting and annoying visual flickers went away and it started looking like a decent app.

## Trial and error

The most grueling part was some of the Swing components would not display correctly and somehow kept hidden even though being loaded. With each iteration, installing each updated version of the application to the Kindle meant it having to restart the device each time. Even with the scripts, the restart would take a couple minutes at a time and then on top of that seeing each iteration of the game getting worse and worse was very demoralising.

To mitigate the memory problem, the grid updates by swapping references with each generation instead of copying the values of each individual cell, which helped.

```java
    private void evolve() {
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                int neighbors = countNeighbors(x, y);
                if (grid[x][y]) {
                    nextGrid[x][y] = neighbors == 2 || neighbors == 3;
                } else {
                    nextGrid[x][y] = neighbors == 3;
                }
            }
        }
        
        boolean[][] temp = grid;
        grid = nextGrid;
        nextGrid = temp;
    }
```

## Working implementation

<p align="center">
    <img src="/assets/images/kindleGameOfLifePost/4.jpg" height="1000" width="500">
</p>

Once I had the game grid down I brought back the features from the applet: the speed control panel that delays the frames at which evolutions generate, a reset button and some counters that refresh every other second to avoid the ghosting issues.

---
# Final thoughts

Happy with how the project ended up being, the application itself is meh but the ebb and flow of the entire journey was time well spent in my opinion. Larping as a real developer for a couple months was pretty enjoyable, although next time I would choose to put more emphasis on the actual worth/value the project brings other people.

*Happy coding :)*
---

# Appendix

1. [Kindle Game Of Life](https://github.com/n0tori/kindle-game-of-life)
2. [Game Of Life Applet](https://github.com/n0tori/game-of-life-applet)