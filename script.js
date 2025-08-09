// ===========================
// グローバル設定
// ===========================
const STORAGE_KEY = 'ark_event_waitlist';
const ANIMATION_DURATION = 1000;

// ===========================
// ローディング画面
// ===========================
// ローディング画面を即座に表示（既にHTMLで表示されている）
// DOMContentLoadedで最小限の遅延後に非表示
document.addEventListener('DOMContentLoaded', () => {
    // 屋形船のアニメーションを見せるため、3秒表示
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        initializeAnimations();
    }, 3000);
});

// ===========================
// カスタムカーソル
// ===========================
if (window.matchMedia('(hover: hover)').matches) {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            follower.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    });
}

// ===========================
// パーティクルアニメーション
// ===========================
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

initParticles();

// ===========================
// ナビゲーションスクロール
// ===========================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===========================
// スムーズスクロール
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// ギャラリータブ
// ===========================
const tabButtons = document.querySelectorAll('.tab-btn');
const galleryContents = document.querySelectorAll('.gallery-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const eventId = button.dataset.event;
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        galleryContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`event-${eventId}`).classList.add('active');
    });
});

// ===========================
// 統計カウントアップ
// ===========================
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                number.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// ===========================
// Intersection Observer
// ===========================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // 統計セクションの場合はカウントアップを開始
                if (entry.target.classList.contains('stats-container')) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素を監視
    document.querySelectorAll('.concept-card, .gallery-item, .stats-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===========================
// シェア機能（グローバル関数として定義）
// ===========================
window.shareTwitter = function() {
    const shareText = 'AI屋形船イベント第3回の開催が決定！ウェイティングリストに登録して、新しい出会いと発見の場に参加しませんか？\n\n#AI屋形船';
    const shareUrl = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

window.shareFacebook = function() {
    const shareUrl = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

window.copyLink = async function() {
    const shareUrl = window.location.href;
    try {
        await navigator.clipboard.writeText(shareUrl);
        const btn = document.querySelector('.copy-link');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>コピーしました！</span>';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        alert('リンクのコピーに失敗しました。');
    }
}

// ===========================
// カウント表示（Notionフォームのため削除）
// ===========================
const waitlistCount = document.getElementById('waitlist-count');
if (waitlistCount) {
    // Notionフォームを使用するため、固定値を表示
    waitlistCount.textContent = '24';
}

// ===========================
// Back to Top
// ===========================
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 簡易フォームの処理
const quickForm = document.getElementById('quick-register');
if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('quick-name').value;
        const sns = document.getElementById('quick-sns').value;
        
        // Notionフォームへリダイレクト（データをURLパラメータとして渡す）
        const notionUrl = 'https://nocall.notion.site/24a295fd200880c7b304c737f0dfaaec';
        window.open(notionUrl, '_blank');
        
        // フォームをリセット
        quickForm.reset();
        
        // 成功メッセージを表示
        const submitBtn = quickForm.querySelector('.quick-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Notionフォームを開きました';
        submitBtn.style.background = 'var(--primary-gradient)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
        }, 3000);
    });
}

// コンソールメッセージ
console.log('%c🚢 AI屋形船イベント - 第3回開催決定', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('ウェイティングリストの登録はNotionフォームから行われます。');