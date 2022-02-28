Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users
  root to: 'pages#home'

  get '/notifications', to: 'comments#index', as: 'notifications'
  get '/route', to: 'route#show', as: 'route'

  resources :incidents
  resources :incidents do
    resources :comments
  end
end
