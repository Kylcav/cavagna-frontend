import LoginTemplate from "@modules/account/templates/login-template"

// Slot @login pour les sous-chemins (/account/orders, /account/profile...).
// Sans ce default, un accès direct à un sous-chemin renvoie 404 (le slot @login
// n'a pas de correspondance). Rendu seulement quand l'utilisateur n'est pas
// connecté (sinon le layout affiche @dashboard).
export default function LoginDefault() {
  return <LoginTemplate />
}
