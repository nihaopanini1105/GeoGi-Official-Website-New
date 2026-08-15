# GeoGi Official Website Sync Policy

## Source of truth

- GitHub repository: `nihaopanini1105/GeoGi-Official-Website-New`
- Development branch: feature/fix/release branches
- Release branch: `main`
- Gitee repository: `sanshen-tech/geogi_order_web`
- Gitee deployment branch: `master`

GitHub `main` is the only authoritative source for website code and release history.

## Release path

1. Changes are developed on a GitHub branch.
2. A Pull Request targets `main`.
3. `Website QA` must pass.
4. The Pull Request is merged to `main`.
5. A successful `Website QA` run on `main` is the only event allowed to trigger Gitee synchronization.
6. The approved GitHub commit is pushed to Gitee `master`.
7. The sync job verifies that Gitee `master` resolves to the exact approved GitHub commit.

## Safety rules

- Never develop directly on Gitee `master`.
- Never force-push Gitee from the automatic sync workflow.
- If Gitee `master` contains commits that are not ancestors of the approved GitHub commit, synchronization must stop and require investigation.
- A failed or cancelled `Website QA` run must never update Gitee.
- Gitee credentials must be stored only in GitHub Actions secrets and must never be committed to the repository.
- Synchronization is controlled by the GitHub Actions repository variable `GITEE_SYNC_ENABLED`; it must equal `true` for the sync job to run.

## Required GitHub Actions configuration

Repository secrets:

- `GITEE_USERNAME`: Gitee account used for repository write access.
- `GITEE_TOKEN`: Gitee personal access token with the minimum repository write permission required for `sanshen-tech/geogi_order_web`.

Repository variable:

- `GITEE_SYNC_ENABLED=true`

## Recovery

If automatic synchronization stops because histories diverge, do not use a force push. Compare the Gitee-only commits with GitHub `main`, decide whether any change must be preserved, migrate approved changes into GitHub through a Pull Request, and only then resume synchronization.
