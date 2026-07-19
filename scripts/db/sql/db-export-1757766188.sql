PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "Like" (
    "id" integer PRIMARY KEY,
    "post" text NOT NULL UNIQUE,
    "likes" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "post_view" (
    "id" integer PRIMARY KEY,
    "post" text NOT NULL UNIQUE,
    "views" integer NOT NULL DEFAULT 0
);

INSERT INTO
    post_view
VALUES (
        1,
        '2024-04-05-how-to-fix-kde-plasma-global-menu-not-working',
        263
    );

INSERT INTO
    post_view
VALUES (
        2,
        '2024-04-09-how-to-fix-zsh-icons-in-visual-studio-code-terminal',
        173
    );

INSERT INTO
    post_view
VALUES (
        3,
        '2024-03-27-the-with-statement-in-python',
        27
    );

INSERT INTO post_view VALUES ( 4, '2023-07-19-hello-world', 60 );

INSERT INTO post_view VALUES ( 5, '2023-07-22-linux-for-beginners', 17 );

INSERT INTO
    post_view
VALUES (
        6,
        '2023-07-21-every-important-http-status-code-explained',
        19
    );

INSERT INTO
    post_view
VALUES (
        7,
        '2024-04-13-complete-guide-setting-up-global-user-authentication-context-in-react',
        111
    );

INSERT INTO
    post_view
VALUES (
        8,
        '2023-07-22-overcoming-project-roadblocks-for-college-students',
        12
    );

INSERT INTO
    post_view
VALUES (
        9,
        '2024-04-19-how-to-install-and-manage-multiple-java-versions-on-linux',
        233
    );

INSERT INTO
    post_view
VALUES (
        10,
        '2024-05-02-rust-programming-beginner-friendly-guide-interactive-activities',
        7
    );

INSERT INTO
    post_view
VALUES (
        11,
        '2024-07-24-integrating-firebase-auth-into-your-astro-project-with-astro-actions',
        201
    );

INSERT INTO
    post_view
VALUES (
        12,
        '2024-08-04-setting-up-a-nodejs-express-project-with-typescript',
        3
    );

INSERT INTO
    post_view
VALUES (
        13,
        '2024-08-04-complete-guide-to-setting-up-node-js-express-project-with-typescript',
        217
    );

INSERT INTO
    post_view
VALUES (
        14,
        '2024-08-11-getting-started-with-ffmpeg-on-linux-comprehensive-guide',
        96
    );

INSERT INTO
    post_view
VALUES (
        15,
        '2024-08-15-understanding-x11-and-wayland-window-servers-behind-your-screen',
        73
    );

INSERT INTO
    post_view
VALUES (
        16,
        '2024-08-21-building-my-personal-arch-linux-setup-from-scratch',
        180
    );

INSERT INTO
    post_view
VALUES (
        17,
        '2024-08-21-ultimate-guide-to-setting-up-zsh-with-oh-my-zsh-and-powerlevel10k-for-a-stunning-terminal',
        106
    );

INSERT INTO
    post_view
VALUES (
        18,
        '2024-10-04-ultimate-guide-setting-up-vps-server-for-beginners',
        116
    );

INSERT INTO
    post_view
VALUES (
        19,
        '2024-10-04-simple-nginx-installation-guide-power-up-your-server',
        158
    );

INSERT INTO
    post_view
VALUES (
        20,
        '2024-10-04-setting-up-nginx-on-ubuntu-make-your-web-server-awesome',
        226
    );

INSERT INTO
    post_view
VALUES (
        21,
        '2024-10-04-adding-rate-limiting-to-nginx-protect-your-website',
        204
    );

INSERT INTO
    post_view
VALUES (
        22,
        '2024-10-04-deploy-nodejs-api-nginx-reverse-proxy',
        165
    );

INSERT INTO
    post_view
VALUES (
        23,
        '2024-10-04-setting-up-ssl-nginx-ubuntu-secure-site-magic-shield',
        95
    );

INSERT INTO
    post_view
VALUES (
        24,
        '2024-10-05-connecting-remote-servers-dolphin-file-manager',
        192
    );

INSERT INTO
    post_view
VALUES (
        25,
        '2024-10-15-mern-stack-deployment-from-development-to-production',
        214
    );

COMMIT;