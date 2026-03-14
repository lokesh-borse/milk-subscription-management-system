module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./milkman",
      script: "../venv/bin/python",
      args: "manage.py runserver 0.0.0.0:8000",
      env: {
        DJANGO_SETTINGS_MODULE: "milkman.settings"
      }
    },
    {
      name: "reactuser",
      cwd: "./reactuser",
      script: "npm",
      args: "run dev",
      env: {
        HOST: "0.0.0.0",
        PORT: "5173"
      }
    },
    {
      name: "reactadmin",
      cwd: "./reactadmin",
      script: "npm",
      args: "run dev",
      env: {
        HOST: "0.0.0.0",
        PORT: "5174"
      }
    }
  ]
};
