<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Form\ChallengeType;
use AppBundle\Entity\Challenge;

class CreateController extends Controller
{
    /**
     * @Route("/create", name="create")
     */
    public function indexAction(Request $request)
    {

        $challenge = new Challenge();
        $form = $this->createForm('AppBundle\Form\ChallengeType', $challenge);
        $form->handleRequest($request);
        
        $em = $this->getDoctrine()->getManager();

        if ($form->isSubmitted() && $form->isValid()) {
            // dump($request);exit;

            $user = $this->getUser();
            // dump($user);exit;

            $coordRoundOne = $request->request->get('RoundOne');
            $coordRoundTwo = $request->request->get('RoundTwo');
            $coordRoundThree = $request->request->get('RoundThree');
            $coordRoundFour = $request->request->get('RoundFour');
            $coordRoundFive = $request->request->get('RoundFive');

            $coords = $coordRoundOne.";".$coordRoundTwo.";".$coordRoundThree.";".$coordRoundFour.";".$coordRoundFive;

            $challenge->setCoords($coords);
            $challenge->setCreator($user);

            $em->persist($challenge);
            $em->flush();

            return $this->render('default/index.html.twig');
        }

        return $this->render('default/create.html.twig', array(
            'form' => $form->createView(),
        ));
    }
}
