class RankingsTable {
    constructor() {
        this.tableBody = document.getElementById('rankingsBody');
        this.loadRankings();
        this.updateUserInfo();
    }

    loadRankings() {
        const users = JSON.parse(localStorage.getItem('tetrisUsers')) || [];

        if (users.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No players yet. Be the first to register and play!</td></tr>';
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.tableBody.innerHTML = '';

        users.forEach((user, index) => {
            const row = document.createElement('tr');

            const isCurrentUser = currentUser && currentUser.email === user.email;
            if (isCurrentUser) {
                row.classList.add('current-user');
            }

            if (index < 3) {
                row.classList.add(`rank-${index + 1}`);
            }

            const rankCell = document.createElement('td');
            if (index === 0) {
                rankCell.innerHTML = '<span class="rank-medal">🥇</span>';
            } else if (index === 1) {
                rankCell.innerHTML = '<span class="rank-medal">🥈</span>';
            } else if (index === 2) {
                rankCell.innerHTML = '<span class="rank-medal">🥉</span>';
            } else {
                rankCell.textContent = index + 1;
            }
            row.appendChild(rankCell);

            const playerCell = document.createElement('td');
            playerCell.textContent = user.displayName || user.username;
            row.appendChild(playerCell);

            const scoreCell = document.createElement('td');
            scoreCell.textContent = user.highScore || 0;
            row.appendChild(scoreCell);

            const levelCell = document.createElement('td');
            levelCell.textContent = user.level || 0;
            row.appendChild(levelCell);

            const linesCell = document.createElement('td');
            linesCell.textContent = user.lines || 0;
            row.appendChild(linesCell);

            const avatarCell = document.createElement('td');
            const avatarDisplay = document.createElement('span');
            avatarDisplay.className = `avatar-display ${this.getAvatarClass(user.avatar)}`;
            avatarDisplay.textContent = this.getAvatarSymbol(user.avatar);
            avatarCell.appendChild(avatarDisplay);
            row.appendChild(avatarCell);

            this.tableBody.appendChild(row);
        });
    }

    getAvatarClass(avatar) {
        const typeMap = {
            'tetromino-i': 'avatar-i',
            'tetromino-o': 'avatar-o',
            'tetromino-t': 'avatar-t',
            'tetromino-s': 'avatar-s',
            'tetromino-z': 'avatar-z',
            'tetromino-j': 'avatar-j',
            'tetromino-l': 'avatar-l'
        };
        return typeMap[avatar] || 'avatar-i';
    }

    getAvatarSymbol(avatar) {
        const symbolMap = {
            'tetromino-i': 'I',
            'tetromino-o': 'O',
            'tetromino-t': 'T',
            'tetromino-s': 'S',
            'tetromino-z': 'Z',
            'tetromino-j': 'J',
            'tetromino-l': 'L'
        };
        return symbolMap[avatar] || 'I';
    }

    updateUserInfo() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userInfoElement = document.getElementById('userInfo');

        if (currentUser && userInfoElement) {
            userInfoElement.textContent = `Player: ${currentUser.displayName || currentUser.username}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RankingsTable();
});
