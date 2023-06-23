# Power Commit

Introducing the ultimate productivity booster for developers and programmers: the Visual Studio Code Extension to quickly commit to Git!

Say goodbye to the tedium of manual commits and embrace lightning-fast workflows with just a single hotkey.

This game-changing extension empowers you to submit changes instantly, shaving off countless precious seconds and boosting your efficiency like never before. With thousands of iterations, it's the secret weapon that transforms you into a speed demon of version control.

Get ready to supercharge your development process and experience the exhilaration of rapid commits with this must-have extension!

## [Extension Home Page](https://marketplace.visualstudio.com/items?itemName=Eshnek.power-commit&ssr=false)

## Usage

Bind a keyboard shortcut to the `powercommit.powerCommit` command.

Alternatively, manually activate the extension by searching for it in the context menu.

**Warning: Generally incompatible with team work, unless people are okay with timestamp commits.**

**Warning: May have unintended consequences. Be sure to read below to understand exactly what the extension does.**

## Details

When invoked, the extension will:
1. Report a notification to the user.
1. Determine the root path of the currently selected editor.
1. Save all files.
1. Execute `git add .`, staging all files.
1. Execute `git commit -m "..."`, committing a timestamp message.
1. Execute `git pull`
1. Execute `git push`
1. Report a notification to the user.

All commands are run in the determined editor root folder.

Failures are reported to the user via notification.

The timestamp typically looks like this: `6/21/2023 14:28 +`

Nothing happens when there are no changes - Git simply rejects the commands.
