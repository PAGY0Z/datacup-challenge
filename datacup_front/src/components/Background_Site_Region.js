import React from "react";

const Background_Site_Region = () => {
  return (
    <div className="bg-gray-100 h-full">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Démarches CR Réunion</h1>
          <nav className="flex gap-4">
            <a href="#home" className="hover:text-gray-200">Accueil</a>
            <a href="#services" className="hover:text-gray-200">Services</a>
            <a href="#contact" className="hover:text-gray-200">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-cover bg-center text-white" style={{ backgroundImage: "url('https://via.placeholder.com/1920x500')" }}>
        <div className="container mx-auto text-center py-20">
          <h2 className="text-4xl font-bold mb-4">Bienvenue sur Démarches CR Réunion</h2>
          <p className="text-lg">Simplifiez vos démarches administratives en quelques clics.</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Nos Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Service 1</h4>
              <p>Découvrez nos services pour faciliter vos démarches administratives.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Service 2</h4>
              <p>Une solution rapide et efficace pour vos besoins administratifs.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Service 3</h4>
              <p>Un accompagnement personnalisé pour toutes vos démarches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-200 py-12">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Contactez-nous</h3>
          <p className="mb-4">Une question ? Besoin d'assistance ? Contactez notre équipe !</p>
          <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">Contact</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Démarches CR Réunion. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Background_Site_Region;