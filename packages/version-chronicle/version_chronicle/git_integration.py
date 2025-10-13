"""
Production Git Integration
Uses GitPython for real git operations
Original implementation by Joshua Terranova
"""

from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import os


@dataclass
class CommitInfo:
    """Information about a git commit"""
    sha: str
    message: str
    author: str
    email: str
    timestamp: datetime
    parents: List[str]
    files_changed: List[str]


@dataclass
class BranchInfo:
    """Information about a git branch"""
    name: str
    commit: str
    is_current: bool


@dataclass
class DiffInfo:
    """Information about file changes"""
    file_path: str
    change_type: str  # 'A' (added), 'M' (modified), 'D' (deleted), 'R' (renamed)
    insertions: int
    deletions: int
    diff_text: str


class GitIntegration:
    """
    Production Git integration using GitPython
    """
    
    def __init__(self, repo_path: Optional[str] = None):
        """
        Initialize Git integration
        
        Args:
            repo_path: Path to git repository (defaults to current directory)
        """
        self.repo_path = repo_path or os.getcwd()
        self.repo = None
        self._ensure_import()
        self._open_repo()
    
    def _ensure_import(self):
        """Lazy import GitPython"""
        try:
            import git
            self.git = git
        except ImportError:
            raise ImportError("GitPython is required. Install with: pip install GitPython")
    
    def _open_repo(self):
        """Open the git repository"""
        try:
            self.repo = self.git.Repo(self.repo_path, search_parent_directories=True)
        except self.git.InvalidGitRepositoryError:
            raise ValueError(f"No git repository found at {self.repo_path}")
        except self.git.NoSuchPathError:
            raise ValueError(f"Path does not exist: {self.repo_path}")
    
    def get_current_branch(self) -> str:
        """Get the name of the current branch"""
        return self.repo.active_branch.name
    
    def get_all_branches(self, include_remote: bool = False) -> List[BranchInfo]:
        """
        Get all branches
        
        Args:
            include_remote: Include remote branches
        
        Returns:
            List of BranchInfo objects
        """
        branches = []
        current_branch = self.repo.active_branch.name
        
        # Local branches
        for branch in self.repo.branches:
            branches.append(BranchInfo(
                name=branch.name,
                commit=branch.commit.hexsha,
                is_current=(branch.name == current_branch)
            ))
        
        # Remote branches
        if include_remote:
            for ref in self.repo.remotes.origin.refs:
                branches.append(BranchInfo(
                    name=ref.name,
                    commit=ref.commit.hexsha,
                    is_current=False
                ))
        
        return branches
    
    def get_commit_history(self, max_count: int = 50, branch: Optional[str] = None) -> List[CommitInfo]:
        """
        Get commit history
        
        Args:
            max_count: Maximum number of commits to retrieve
            branch: Specific branch (defaults to current)
        
        Returns:
            List of CommitInfo objects
        """
        if branch:
            commits = list(self.repo.iter_commits(branch, max_count=max_count))
        else:
            commits = list(self.repo.iter_commits(max_count=max_count))
        
        commit_infos = []
        for commit in commits:
            commit_infos.append(CommitInfo(
                sha=commit.hexsha,
                message=commit.message.strip(),
                author=commit.author.name,
                email=commit.author.email,
                timestamp=datetime.fromtimestamp(commit.committed_date),
                parents=[p.hexsha for p in commit.parents],
                files_changed=[item.a_path for item in commit.stats.files.keys()]
            ))
        
        return commit_infos
    
    def get_file_history(self, file_path: str, max_count: int = 50) -> List[CommitInfo]:
        """
        Get commit history for a specific file
        
        Args:
            file_path: Path to file
            max_count: Maximum number of commits
        
        Returns:
            List of CommitInfo objects
        """
        commits = list(self.repo.iter_commits(paths=file_path, max_count=max_count))
        
        commit_infos = []
        for commit in commits:
            commit_infos.append(CommitInfo(
                sha=commit.hexsha,
                message=commit.message.strip(),
                author=commit.author.name,
                email=commit.author.email,
                timestamp=datetime.fromtimestamp(commit.committed_date),
                parents=[p.hexsha for p in commit.parents],
                files_changed=[file_path]
            ))
        
        return commit_infos
    
    def get_diff(self, commit1: Optional[str] = None, commit2: Optional[str] = None) -> List[DiffInfo]:
        """
        Get diff between commits
        
        Args:
            commit1: First commit (defaults to HEAD)
            commit2: Second commit (defaults to working directory)
        
        Returns:
            List of DiffInfo objects
        """
        if commit1 is None and commit2 is None:
            # Compare working directory with HEAD
            diff_index = self.repo.head.commit.diff(None)
        elif commit2 is None:
            # Compare commit with working directory
            commit_obj = self.repo.commit(commit1)
            diff_index = commit_obj.diff(None)
        else:
            # Compare two commits
            commit1_obj = self.repo.commit(commit1)
            commit2_obj = self.repo.commit(commit2)
            diff_index = commit1_obj.diff(commit2_obj)
        
        diff_infos = []
        for diff_item in diff_index:
            change_type = 'M'  # Modified
            if diff_item.new_file:
                change_type = 'A'  # Added
            elif diff_item.deleted_file:
                change_type = 'D'  # Deleted
            elif diff_item.renamed_file:
                change_type = 'R'  # Renamed
            
            file_path = diff_item.b_path if diff_item.b_path else diff_item.a_path
            
            diff_text = ""
            try:
                if diff_item.diff:
                    diff_text = diff_item.diff.decode('utf-8', errors='ignore')
            except Exception:
                diff_text = "<binary file>"
            
            # Count insertions and deletions
            insertions = diff_text.count('\n+') if diff_text else 0
            deletions = diff_text.count('\n-') if diff_text else 0
            
            diff_infos.append(DiffInfo(
                file_path=file_path,
                change_type=change_type,
                insertions=insertions,
                deletions=deletions,
                diff_text=diff_text
            ))
        
        return diff_infos
    
    def get_status(self) -> Dict[str, List[str]]:
        """
        Get repository status
        
        Returns:
            Dictionary with lists of modified, added, deleted, untracked files
        """
        return {
            'modified': [item.a_path for item in self.repo.index.diff(None)],
            'staged': [item.a_path for item in self.repo.index.diff('HEAD')],
            'untracked': self.repo.untracked_files,
        }
    
    def get_blame(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Get blame information for a file
        
        Args:
            file_path: Path to file
        
        Returns:
            List of blame entries with commit info and line content
        """
        blame_entries = []
        
        try:
            blame = self.repo.blame('HEAD', file_path)
            
            for commit, lines in blame:
                for line in lines:
                    blame_entries.append({
                        'sha': commit.hexsha,
                        'author': commit.author.name,
                        'email': commit.author.email,
                        'timestamp': datetime.fromtimestamp(commit.committed_date),
                        'message': commit.message.strip(),
                        'line': line.strip(),
                    })
        except Exception as e:
            raise ValueError(f"Could not get blame for {file_path}: {e}")
        
        return blame_entries
    
    def get_contributors(self) -> List[Dict[str, Any]]:
        """
        Get list of contributors with their commit counts
        
        Returns:
            List of contributor info
        """
        contributors = {}
        
        for commit in self.repo.iter_commits():
            author_key = (commit.author.name, commit.author.email)
            
            if author_key not in contributors:
                contributors[author_key] = {
                    'name': commit.author.name,
                    'email': commit.author.email,
                    'commits': 0,
                    'last_commit': None,
                }
            
            contributors[author_key]['commits'] += 1
            
            if contributors[author_key]['last_commit'] is None or \
               commit.committed_date > contributors[author_key]['last_commit']:
                contributors[author_key]['last_commit'] = datetime.fromtimestamp(commit.committed_date)
        
        return sorted(contributors.values(), key=lambda x: x['commits'], reverse=True)
    
    def search_commits(self, search_string: str, max_count: int = 50) -> List[CommitInfo]:
        """
        Search commits by message
        
        Args:
            search_string: String to search for
            max_count: Maximum number of commits to search
        
        Returns:
            List of matching CommitInfo objects
        """
        matching_commits = []
        
        for commit in self.repo.iter_commits(max_count=max_count):
            if search_string.lower() in commit.message.lower():
                matching_commits.append(CommitInfo(
                    sha=commit.hexsha,
                    message=commit.message.strip(),
                    author=commit.author.name,
                    email=commit.author.email,
                    timestamp=datetime.fromtimestamp(commit.committed_date),
                    parents=[p.hexsha for p in commit.parents],
                    files_changed=[item.a_path for item in commit.stats.files.keys()]
                ))
        
        return matching_commits
    
    def get_tags(self) -> List[Dict[str, Any]]:
        """Get all tags"""
        tags = []
        
        for tag in self.repo.tags:
            tags.append({
                'name': tag.name,
                'commit': tag.commit.hexsha,
                'message': tag.tag.message if hasattr(tag, 'tag') and tag.tag else "",
            })
        
        return tags
    
    def get_repo_stats(self) -> Dict[str, Any]:
        """Get repository statistics"""
        commits = list(self.repo.iter_commits())
        
        return {
            'total_commits': len(commits),
            'total_branches': len(list(self.repo.branches)),
            'total_tags': len(list(self.repo.tags)),
            'total_contributors': len(self.get_contributors()),
            'first_commit': datetime.fromtimestamp(commits[-1].committed_date) if commits else None,
            'last_commit': datetime.fromtimestamp(commits[0].committed_date) if commits else None,
        }

