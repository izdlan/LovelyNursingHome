// Loading component for all pages
class PageLoader {
    constructor() {
        this.loadingHtml = `
            <div id="page-loader" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #f4f7f9 0%, #cfd8e8 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                flex-direction: column;
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid #e3e3e3;
                    border-top: 4px solid #3578c7;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <div style="
                    color: #3578c7;
                    font-size: 18px;
                    font-weight: 600;
                    text-align: center;
                ">Loading...</div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    show() {
        if (!document.getElementById('page-loader')) {
            document.body.insertAdjacentHTML('afterbegin', this.loadingHtml);
        }
    }

    hide() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }

    // Auto-hide after page load
    autoHide() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.hide(), 500);
            });
        } else {
            setTimeout(() => this.hide(), 500);
        }
    }
}

// Global loader instance
window.pageLoader = new PageLoader();

// Show loader immediately when script loads
window.pageLoader.show();

// Auto-hide when page is ready
window.pageLoader.autoHide();

// Show loader when navigating to new pages
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (link && link.href && !link.href.includes('#') && !link.href.includes('javascript:')) {
    // Don't show loader for same-page links or javascript links
    if (link.href !== window.location.href) {
      window.pageLoader.show();
    }
  }
});

// Show loader when submitting forms
document.addEventListener('submit', function(e) {
  window.pageLoader.show();
}); 