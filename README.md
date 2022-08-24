# PR Bundle Analyzer
A Github Action to analyse your Build Bundle and show stats difference with the Base Branch on each pull request generated. Using this action, developers can check the logs & overall code size compression on every pull request i.e feature basis. If the new changes are making significant increase then they can simply optimise thier code. 

## Output Stats
<img width="948" alt="Screenshot 2022-08-24 at 9 36 06 AM" src="https://user-images.githubusercontent.com/90181918/186326913-b2c3716c-6b0a-4e45-bf36-ba1aa2d581c8.png">


## Usage:

Checkout [action.yml](./action.yml)

Please check the below code for detailed usage:
```yaml
steps:
      - uses: bharatpe/pr-bundle-analyzer@main
        with:
          install_command: 'yarn install'
          build_command: 'yarn run build'
          build_path: 'build/static'
          base_branch: ${{ github.base_ref }}
          head_branch: ${{ github.head_ref }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

By default github actions work on `node 12`.For a specific node version use:

```yaml
- uses: actions/setup-node@v1
        with:
          node-version: '16.16.0'
```

**Ex:**
```yaml
steps:
      - uses: actions/setup-node@v1
        with:
          node-version: '16.16.0'
      - uses: bharatpe/pr-bundle-analyzer@main
        with:
          install_command: 'yarn install'
          build_command: 'yarn run build'
          build_path: 'build/static'
          base_branch: ${{ github.base_ref }}
          head_branch: ${{ github.head_ref }}
          token: ${{ secrets.GITHUB_TOKEN }}

```

Also check [Demo.yml](./demo.yml) for complete configuration(on using github actions)

## License
The scripts and documentation in this project are released under the [MIT License](./LICENSE)
