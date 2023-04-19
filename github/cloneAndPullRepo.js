import child_process from 'child_process';

export default (repoExists = false, username = '', repo = '', branch = 'master') => {
  if (!repoExists) {
    child_process.execSync(`git clone https://${username}:${process.env.PERSONAL_ACCESS_TOKEN}@github.com/${username}/${repo}.git repos/${username}/${repo}`);
    child_process.execSync(`cd repos/${username}/${repo} && git checkout ${branch}`)
  } else {
    child_process.execSync(`cd repos/${username}/${repo} && git pull origin ${branch} --rebase`);
  }
}