module.exports = {
  apps: [
    {
      name: "backend",
      script: "./venv/Scripts/python.exe",
      args: "milkman/manage.py runserver 0.0.0.0:8000",
      cwd: "./"
    },
    {
      name: "reactuser",
      script: "cmd",
      args: "/c npm run dev",
      cwd: "./reactuser"
    },
    {
      name: "reactadmin",
      script: "cmd",
      args: "/c npm run dev",
      cwd: "./reactadmin"
    }
  ]
};
