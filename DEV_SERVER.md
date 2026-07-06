# Launching the Dev Server

This site is built with Jekyll through the `github-pages` gem.

## First-Time Setup

Install the Ruby dependencies:

```sh
bundle install
```

## Start the Server

Run the local Jekyll server:

```sh
bundle exec jekyll serve
```

Then open:

```text
http://127.0.0.1:4000
```

## Live Reload

If you want the browser to refresh automatically after file changes, run:

```sh
bundle exec jekyll serve --livereload
```

Stop the server with `Ctrl+C` in the terminal.
