$(document).ready(function() {
    let members = JSON.parse(localStorage.getItem('members')) || [];
    // 数値型として確実に取得
    let goalDistance = Number(localStorage.getItem('goalDistance')) || 0;

    // 初期表示時に保存された目標値を表示
    $('#goalDisplay').text(goalDistance);

    // 初期表示
    updateDisplay();

    // 目標設定の数値を入力
    $('#setGoal').click(function() {
        const inputValue = $('#goalDistance').val();
        if (inputValue !== '') {  // 入力値が空でないことを確認
            goalDistance = Number(inputValue);
            localStorage.setItem('goalDistance', goalDistance);
            updateDisplay();
        }
    });

    // メンバー追加
    $('#addMember').click(function() {
        const name = $('#memberName').val();
        if (name) {
            members.push({
                name: name,
                distance: 0
            });
            localStorage.setItem('members', JSON.stringify(members));
            updateDisplay();
            $('#memberName').val('');
        }
    });

    // リセットボタン
    $('#resetAll').click(function() {
        if (confirm('データリセットします。来月もがんばろう！')) {
            members = [];
            goalDistance = 0;
            
            localStorage.removeItem('members');
            localStorage.removeItem('goalDistance');
            
            $('#goalDistance').val('');
            $('#memberName').val('');
            
            updateDisplay();
        }
    });

    // メンバー削除
    function deleteMember(index) {
        members.splice(index, 1);
        localStorage.setItem('members', JSON.stringify(members));
        updateDisplay();
    }

    // 画面更新
    function updateDisplay() {
        // メンバー記録の表示
        $('#memberRecords').empty();
        members.forEach((member, index) => {
            const memberHtml = `
                <div class="member-record">
                    <span>${member.name}</span>
                    <input type="number" value="${member.distance}" 
                    class="distance-input" data-index="${index}">
                    <span>km</span>
                    <button class="delete-btn" data-index="${index}">削除</button>
                </div>
            `;
            $('#memberRecords').append(memberHtml);
        });

        // 削除ボタン
        $('.delete-btn').click(function() {
            const index = $(this).data('index');
            deleteMember(index);
        });

        // 距離入力
        $('.distance-input').on('change', function() {
            const index = $(this).data('index');
            members[index].distance = Number($(this).val());
            localStorage.setItem('members', JSON.stringify(members));
            updateDisplay();
        });

        // 総距離と達成率の計算
        const totalDistance = members.reduce((sum, member) => 
            sum + member.distance, 0);
        const achievementRate = goalDistance > 0 ? 
            (totalDistance / goalDistance * 100).toFixed(1) : 0;

        // 表示の更新
        $('#totalDistance').text(totalDistance.toFixed(1));
        $('#goalDisplay').text(goalDistance);
        $('#achievementRate').text(achievementRate);
        $('#progressBar').css('width', `${Math.min(achievementRate, 100)}%`);
    }
});